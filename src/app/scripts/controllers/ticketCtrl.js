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
  'SourcesListApi',
  'ProductsListApi',
  'TypesListApi',
  'TeamsListApi',
  'TeamMembersListApi',
  'TicketTagApi',
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
    SourcesListApi,
    ProductsListApi,
    TypesListApi,
    TeamsListApi,
    TeamMembersListApi,
    TicketTagApi){
  headingService.pageHeading.value = 'Issue Details'
  var pages = ['all_issues', 'my_issues', 'my_team_issues'];
  console.log(ticketFilterService.filters);
  $scope.sentiments = [
              {name : 'Happy'},
              {name : 'Neutral'},
              {name : 'Angry'}
            ];
  var items = ['product', 'status', 'sentiment', 'type', 'source', 'owner',
                'assigned', 'assignedTeam', 'ownerTeam', 'tags']
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
    $scope.assignedTeams = data.teams;
  });
  
  for(var i=0; i<pages.length; i++){
    console.log(ticketFilterService.filters[pages[i]])
    if (ticketFilterService.filters[pages[i]] == 1)
      $scope.previousPage = pages[i].replace('_', " ")
  }

  TicketApi.get({id:$routeParams.id}, function(data){
    $scope.ticket = data
    date = new Date(data.created_on * 1000)
    $scope.created_on = date.toString();
    
    //set status
    if( ! (data.status == "RESOLVED" || data.status == "INVALID") ) {
        $scope.statuses.push({name : data.status});
    }
    for( i in $scope.statuses ){
      currentStatus = $scope.statuses[i];
      if(currentStatus.name === data.status) {
        currentStatus.ticked = true;
        $scope.status[0] = currentStatus;
      }
      else{
        currentStatus.ticked = false;
      }
    }
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
        console.log($scope.product);
      }
      else{
        currentProduct.ticked = false;
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
    //set assigned team
    if (data.assignment_details && data.assignment_details.team) {
      for( i in $scope.assignedTeams ){
        currentAssignedTeam = $scope.assignedTeams[i];
        if(currentAssignedTeam.name == data.assignment_details.team.name) {
          currentAssignedTeam.ticked = true;
          $scope.assignedTeam[0] = currentAssignedTeam;
          $scope.getAssignedTeamMembers(currentAssignedTeam, data.assignment_details.member);
        }
        else{
          currentAssignedTeam.ticked = false;
        }
      }
    }

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

  $scope.getOwnerTeamMembers = function(data, memberInfo){
    memberInfo = typeof memberInfo !== 'undefined' ? memberInfo : false;
    console.log("getOwnerTeamMembers");
    console.log(data);
    console.log("memberInfo");
    console.log(memberInfo);
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

  $scope.getAssignedTeamMembers = function(data, memberInfo ){
    TeamMembersListApi.get({team_id : data.id}, function (data){
      for( i in data.members) {
        member = data.members[i];
        member.name = member.user.name;
      }
      $scope.assignedTeamMembers = data.members;
      if (memberInfo) {
        for( i in $scope.assignedTeamMembers){
          assignedTeamMember =  $scope.assignedTeamMembers[i];
          if(memberInfo.id == assignedTeamMember.id){
            assignedTeamMember.ticked = true;
            $scope.assigned = assignedTeamMember;
          }
        }
      }
    }, function (errorData){
      $scope.assignedTeamMembers = [];
    });
  };
  
  $scope.saveTicketDetails = function() {
    
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
