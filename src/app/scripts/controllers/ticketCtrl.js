angular.module('chronos').controller('TicketCtrl',
  [ '$scope',
  '$location',
  'Util',
  '$sce',
  '$routeParams',
  'TicketApi',
  'headingService',
  'ticketFilterService',
  'taOptions',
  'TicketCommentsListApi',
  'TicketMailsApi',
  'UserApi',
  'SourcesListApi',
  'ProductsListApi',
  'TypesListApi',
  'TeamsListApi',
  'TeamMembersListApi',
  'TicketTagApi',
  'AssignmentActionApi',
  function($scope,
    $location,
    Util,
    $sce,
    $routeParams,
    TicketApi,
    headingService,
    ticketFilterService,
    taOptions,
    TicketCommentsListApi,
    TicketMailsApi,
    UserApi,
    SourcesListApi,
    ProductsListApi,
    TypesListApi,
    TeamsListApi,
    TeamMembersListApi,
    TicketTagApi,
    AssignmentActionApi){
  headingService.pageHeading.value = 'Issue Details'
  var pages = ['all_issues', 'my_issues', 'my_team_issues'];
  $scope.sentiments = [
              {name : 'Happy'},
              {name : 'Neutral'},
              {name : 'Angry'}
            ];
  var items = ['product', 'sentiment', 'type', 'source', 'owner',
                'reassigned', 'reassignedTeam', 'ownerTeam', 'tags']
  for (i=0;i<items.length; i++){
    $scope[items[i]] = [];
  }
  //get list of sources
  SourcesListApi.get(function (data) {
    $scope.sources = data.sources;
  });
  //get list of products
  ProductsListApi.get(function (data) {
    $scope.products = data.products;
  });
  //get list of types
  TypesListApi.get(function (data) {
    $scope.types = data.types;
  });
  //get list of owner teams
  TeamsListApi.get( {if_owner : 1}, function (data) {
    $scope.ownerTeams = data.teams;
  });
  //get list of assigned teams
  TeamsListApi.get( {if_assigned : 1}, function (data) {
    $scope.reassignedTeams = data.teams;
  });
  
  for(var i=0; i<pages.length; i++){
    console.log(ticketFilterService.filters[pages[i]])
    if (ticketFilterService.filters[pages[i]] == 1)
      $scope.previousPage = pages[i].replace('_', " ")
  }

  $scope.msToTime = function(duration) {
    var hours = parseInt((duration/(1000*60*60)));
    hours = (hours < 10 && hours > -10) ? "0" + hours : hours;
    return hours;
  };

  $scope.go = function(path) {
    console.log(path);
    $location.path(path);
  };


  TicketApi.get({id:$routeParams.id}, function(data){
    $scope.ticket = data
    $scope.followUpOf = data.child_of;
    date = new Date(data.created_on * 1000)
    $scope.created_on = date.toString();
    $scope.isNotOwner = true;
    //set type
    for( i in $scope.types ){
      currentType = $scope.types[i];
      if(currentType.name == data.type) {
        currentType.ticked = true;
        $scope.type[0] = currentType;
      }
      else{
        currentType.ticked = false;
      }
    }

    diffrence = 0;
    if( data.created_on){
      currentTimeInMilliSeconds = Date.now();
      if (data.sla){
        slaTimeInMilliSeconds = data.sla * 60 * 60 * 1000;
        diffrence = slaTimeInMilliSeconds - (currentTimeInMilliSeconds - data.created_on * 1000);
      }
    }
    $scope.dueTime = $scope.msToTime(diffrence);
    //set source
    for( i in $scope.sources ){
      currentSource = $scope.sources[i];
      if(currentSource.name == data.source) {
        currentSource.ticked = true;
        $scope.source[0] = currentSource;
      }
      else{
         currentSource.ticked = false;
      }
    }
    //set product
    for( i in $scope.products ){
      currentProduct = $scope.products[i];
      if(currentProduct.name == data.product) {
        currentProduct.ticked = true;
        $scope.product[0] = currentProduct;
      }
      else{
        currentProduct.ticked = false;
      }
    }
    //set sentiments
    for( i in $scope.sentiments ){
      currentSentiment = $scope.sentiments[i];
      if(currentSentiment.name == data.sentiment){
        currentSentiment.ticked = true;
        $scope.sentiment[0] = currentSentiment;
      }
      else{
        currentSentiment.ticked = false;
      }
    }
    //set owner team
    if (data.owner_details && data.owner_details.team){
      for( i in $scope.ownerTeams ){
        currentOwnerTeam = $scope.ownerTeams[i];
        if(currentOwnerTeam.name == data.owner_details.team.name) {
          currentOwnerTeam.ticked = true;
          $scope.ownerTeam[0] = currentOwnerTeam;
          $scope.getOwnerTeamMembers(currentOwnerTeam, data.owner_details.member);
        }
        else{
          currentOwnerTeam.ticked = false;
        }
      }
    }
    //set reassigned team
    if (data.assignment_details && data.assignment_details.team) {
      for( i in $scope.reassignedTeams ){
        currentReassignedTeam = $scope.reassignedTeams[i];
        if(currentReassignedTeam.name == data.assignment_details.team.name) {
          currentReassignedTeam.ticked = true;
          $scope.reassignedTeam[0] = currentReassignedTeam;
          $scope.getReassignedTeamMembers(currentReassignedTeam, data.assignment_details.member);
        }
        else{
          currentReassignedTeam.ticked = false;
        }
      }
    }

    //enable owner permissions
    if(data.owner_details && data.owner_details.member && Util.getLoggedInUserId() == data.owner_details.member.user.id) {
       $scope.isNotOwner = false;
    }

  });

  $scope.toggleShowCommenter = function(){
    $scope.data.showCommenter = !$scope.data.showCommenter
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

  $scope.invalidStatus = function () {
    data = {};
    data.id = $scope.ticket.id;
    data.status = 'INVALID';
    TicketApi.update(data, function (data) {
                console.log("status changed");
              }, function (errorData) {
                  console.log(errorData);
              });
  };

  $scope.acknowledgeTicket = function(){
    data = {};
    data.ticket_id = $scope.ticket.id;
    data.action = 'ACKNOWLEDGE';
    AssignmentActionApi.save(data, function(data) {
      console.log("Reassignment done");
    }, function (errorData) {
      console.log(errorData);
    });
  };

  $scope.getSelectedEmail = function(item) {
    console.log(item);
    return item.email + ","
  };
  $scope.searchPeople = function(term) {
    if (term.length > 3){
      UserApi.get({ query: term}, function (data) {
        $scope.data.items = data.users;
      }, function (data) {
        console.log(data);
      });
    }
  };

  $scope.saveTicketDetails = function() {
     var data = {};
              data.id = $scope.ticket.id;
              var items = ['owner', 'ownerTeam']
              var mapping = {
                owner:'set_owner_member',
                ownerTeam:'set_owner_team',
              }
              for(var i=0; i<items.length; i++){
                if ($scope[items[i]].length) {
                  data[mapping[items[i]]] = $scope[items[i]][0].id;
                }
              }
              if ($scope.followUpOf) {
                data.set_followup_of = $scope.followUpOf;
              }
              var dataTags = [];
              for (i=0; i<$scope.tags.length; i++){
                dataTags.push($scope.tags[i].text);
              }
              data.tags = dataTags;
              TicketApi.update(data, function (data) {
                console.log("ticket updated");
              }, function (errorData) {
                  console.log(errorData);
              });

              //ticket reassignment
              data = {}
              data.ticket_id = $scope.ticket.id;
              data.action = 'REASSIGN';
              var items = ['reassignedTeam', 'reassigned']
              var mapping = {
                reassignedTeam : 'reassign_team_id',
                reassigned : 'reassign_member_id',
              }
              for(var i=0; i<items.length; i++){
                if ($scope[items[i]].length) {
                  data[mapping[items[i]]] = $scope[items[i]][0].id;
                }
              }
              AssignmentActionApi.save(data, function(data) {
                console.log("Reassignment done");
              }, function (errorData) {
                console.log(errorData);
              });
  };

   $scope.getOwnerTeamMembers = function(data, memberInfo){
    memberInfo = typeof memberInfo !== 'undefined' ? memberInfo : false;
    TeamMembersListApi.get({team_id : data.id}, function (data){
      for( i in data.members) {
        member = data.members[i];
        member.name = member.user.name;
      }
      $scope.ownerTeamMembers = data.members;
      if (memberInfo) {
        for( i in $scope.ownerTeamMembers){
          ownerTeamMember =  $scope.ownerTeamMembers[i];
          if(memberInfo.id == ownerTeamMember.id){
            ownerTeamMember.ticked = true;
            $scope.owner = ownerTeamMember;
          }
        }
      }
    }, function (errorData){
      $scope.ownerTeamMembers = [];
    });
  };

  $scope.getReassignedTeamMembers = function(data, memberInfo ){
    TeamMembersListApi.get({team_id : data.id}, function (data){
      for( i in data.members) {
        member = data.members[i];
        member.name = member.user.name;
      }
      $scope.reassignedTeamMembers = data.members;
      if (memberInfo) {
        for( i in $scope.reassignedTeamMembers){
          reassignedTeamMember =  $scope.reassignedTeamMembers[i];
          if(memberInfo.id == reassignedTeamMember.id){
            reassignedTeamMember.ticked = true;
            $scope.reassigned = reassignedTeamMember;
          }
        }
      }
    }, function (errorData){
      $scope.reassignedTeamMembers = [];
    });
  };

  $scope.comment="comment"
  // taOptions.toolbar = [
  //     ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
  //     ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
  //     ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
  //     ['comment', 'insertImage','insertLink', 'insertVideo', 'wordcount', 'charcount']
  // ];

  // $scope.temp = $sce.trustAscomment('<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li style="color: blue;">Super Easy <b>Theming</b> Options</li><li>Simple Editor Instance Creation</li><li>Safely Parses comment for Custom Toolbar Icons</li><li>Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE8+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p>')
}]);
