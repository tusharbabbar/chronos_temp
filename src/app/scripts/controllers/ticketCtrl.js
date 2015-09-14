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
  function($scope,
    $sce,
    $routeParams,
    TicketApi,
    headingService,
    ticketFilterService,
    taOptions,
    TicketCommentsListApi,
    TicketMailsApi,
    UserApi){
  headingService.pageHeading.value = 'Issue Details'
  var pages = ['all_issues', 'my_issues', 'my_team_issues'];
  console.log(ticketFilterService.filters)
  for(var i=0; i<pages.length; i++){
    console.log(ticketFilterService.filters[pages[i]])
    if (ticketFilterService.filters[pages[i]] == 1)
      $scope.previousPage = pages[i].replace('_', " ")
  }

  TicketApi.get({id:$routeParams.id}, function(data){
    $scope.ticket = data
    date = new Date(data.created_on * 1000)
    $scope.created_on = date.toString()
  });

  $scope.toggleShowCommenter = function(){
    $scope.data.showCommenter = !$scope.data.showCommenter
    console.log($scope.data.showCommenter)
  }

  // Add comments

  $scope.data = {};
  $scope.data.showCommenter = true;

  $scope.data['comment'] = "";
  $scope.data['mail'] = "";
  $scope.data['subject'] = "";
  $scope.data['to'] = "";
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

  // taOptions.toolbar = [
  //     ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
  //     ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
  //     ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
  //     ['comment', 'insertImage','insertLink', 'insertVideo', 'wordcount', 'charcount']
  // ];

  // $scope.temp = $sce.trustAscomment('<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li style="color: blue;">Super Easy <b>Theming</b> Options</li><li>Simple Editor Instance Creation</li><li>Safely Parses comment for Custom Toolbar Icons</li><li>Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE8+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p>')
}]);
