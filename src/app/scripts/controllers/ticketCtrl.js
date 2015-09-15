angular.module('chronos').controller('TicketCtrl',
  [ '$scope',
  '$sce',
  '$routeParams',
  'TicketApi',
  'headingService',
  'ticketFilterService',
  'taOptions',
  'TicketCommentsListApi',
  'TicketMailsApi',
  'UserApi',
  'TicketTimelineApi',
  'AssignmentActionApi',
  function($scope,
    $sce,
    $routeParams,
    TicketApi,
    headingService,
    ticketFilterService,
    taOptions,
    TicketCommentsListApi,
    TicketMailsApi,
    UserApi,
    TicketTimelineApi,
    AssignmentActionApi){
  headingService.pageHeading.value = 'Issue Details'
  var pages = ['all_issues', 'my_issues', 'my_team_issues'];
  console.log(ticketFilterService.filters)
  for(var i=0; i<pages.length; i++){
    console.log(ticketFilterService.filters[pages[i]])
    if (ticketFilterService.filters[pages[i]] == 1)
      $scope.previousPage = pages[i].replace('_', " ")
  }
  $scope.denyReasons = [{name:'Deny_Need_more_Info'}, {name:'Deny_False_Alarm'}, {name:'Deny_Wrong_Team'},
      {name:'Deny_Wrong_Type'}, {name:'Deny_Other_Reason'}]

  TicketApi.get({id:$routeParams.id}, function(data){
    $scope.ticket = data
    date = new Date(data.created_on * 1000)
    $scope.created_on = date.toString()
  });
  TicketTimelineApi.query({id:$routeParams.id}, function(data){
    for(var i=0; i< data.length; i++){
      date = new Date(data[i]['timestamp'] * 1000)
      data[i]['timestamp'] = date.toString()
    }
    console.log(data[0])
    $scope.timeline = data
    console.log(data)
  })

  $scope.showCommenter = function(){
    $scope.data.showCommenter = true;
    $scope.data.buttonBottom = false;
    $scope.data.showMailer = false;
  }

  $scope.showMailer = function(){
    $scope.data.showCommenter = false;
    $scope.data.buttonBottom = false;
    $scope.data.showMailer = true;
  }
  $scope.hideAll = function(){
    $scope.data.showCommenter = false;
    $scope.data.buttonBottom = true;
    $scope.data.showMailer = false;
  }

  // Add comments

  $scope.data = {};
  $scope.data.showCommenter = false;
  $scope.data.showMailer = false;
  $scope.data.buttonBottom = true;
  $scope.data.showDenyCommenter = false;
  $scope.data.showResolveMailer = false;

  $scope.data['comment'] = "";
  $scope.data['mail'] = "";
  $scope.data['subject'] = "";
  $scope.data['to'] = "";
  $scope.data.denial_reason = []
  $scope.addComment = function(){
    console.log($scope.data.comment)
    if (($scope.data.comment != "") && ($scope.data.comment.length > 10)){
      data = {
        ticket_id : $scope.ticket.id,
        body: $scope.data.comment
      }
      TicketCommentsListApi.save(data, function(data){
        $scope.data.comment = ""
      })
    }
    else {
      alert('htmlVariable must be greater than 10 chars;')
    }
  }
  $scope.addMail = function(){
    console.log($scope.data)
    if (($scope.data.subject != "") && ($scope.data.to != "") && ($scope.data.mail !="")){
      data = {
        id : $scope.ticket.id,
        body: $scope.data.mail,
        recipient: $scope.data.to,
        subject: $scope.data.subject
      }
      TicketMailsApi.save(data, function(data){
        $scope.data['mail'] = "";
        $scope.data['subject'] = "";
        $scope.data['to'] = "";
      })
    }
    else {
      alert("Must specify Subject, Body and To.")
    }
  }
  $scope.getSelectedEmail = function(item) {
    console.log(item);
    return item.email + ","
  };
  $scope.searchPeople = function(term) {
    console.log(term)
    if (term.length > 3){
      UserApi.get({ query: term}, function (data) {
        console.log(data)
        $scope.data.items = data.users;
      }, function (data) {
        console.log(data);
      });
    }
  };
  $scope.pressResolve = function(){
    $scope.data.showResolveMailer = true;
    $scope.data.send_custom_mail = true;
    console.log("resolve")
  }
  $scope.pressDeny = function(){
    $scope.data.showDenyCommenter = true;
    console.log("deny")
  }
  $scope.resolveTicket = function(){
    data = {id: $scope.ticket.id, status : "RESOLVED"}
    if ($scope.data.send_custom_mail === true){
      data.send_custom_mail = 1;
      TicketApi.update(data, function(data){
        $scope.ticket = data
        $scope.data.showResolveMailer = false;
      })
    }
    else {
      if  (($scope.data.subject != "") && ($scope.data.to != "") && ($scope.data.mail !="")){
        data.send_custom_mail = 0
        data.subject = $scope.data.subject
        data.body = $scope.data.mail
        data.mail = $scope.data.to
        TicketApi.update(data, function(data){
          console.log(data)
          $scope.data['mail'] = "";
          $scope.data['subject'] = "";
          $scope.data['to'] = "";
          $scope.ticket = data
          $scope.data.showResolveMailer = false;
        })
      }
      else {
        alert("Must specify Subject, Body and To.")
      }
    }
  }
  $scope.denyAssignment = function(){
    data = {ticket_id: $scope.ticket.id, action: "DENY", assignment_id: $scope.ticket.assignment_details.id}
    console.log($scope.data.comment, $scope.data.denial_reason)
    if (($scope.data.comment != "") && ($scope.data.denial_reason.length === 1)){
      data.deny_comment = $scope.data.comment;
      data.deny_reason = $scope.data.denial_reason[0]['name']
      AssignmentActionApi.save(data, function(data){
        $scope.data.comment = ""
        $scope.data.denial_reason = []
        $scope.data.ticket = data
        $scope.showDenyCommenter = false
      })
    }
  }
  $scope.removeModal = function(){
    $scope.data.showResolveMailer = false
    $scope.data.showDenyCommenter = false
  }

  // taOptions.toolbar = [
  //     ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
  //     ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
  //     ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
  //     ['comment', 'insertImage','insertLink', 'insertVideo', 'wordcount', 'charcount']
  // ];

  // $scope.temp = $sce.trustAscomment('<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li style="color: blue;">Super Easy <b>Theming</b> Options</li><li>Simple Editor Instance Creation</li><li>Safely Parses comment for Custom Toolbar Icons</li><li>Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE8+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p>')
}]);
