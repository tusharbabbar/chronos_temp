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
  'TicketTimelineApi',
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
    TicketTimelineApi,
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
  $scope.denyReasons = [{name:'Need_more_Info'}, {name:'False_Alarm'}, {name:'Wrong_Team'},
      {name:'Wrong_Type'}, {name:'Other_Reason'}]

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

  TicketTimelineApi.query({id:$routeParams.id}, function(data){
    for(var i=0; i< data.length; i++){
      date = new Date(data[i]['timestamp'] * 1000)
      data[i]['date'] = date.toString()
    }
    $scope.timeline = data
  })

  $scope.updateTimeline = function(timestamp){
    data = {
      id:$routeParams.id,
      timestamp:timestamp
    };
    TicketTimelineApi.query(data, function(data){
      for(var i=0; i< data.length; i++){
        date = new Date(data[i]['timestamp'] * 1000)
        data[i]['date'] = date.toString()
      }
      $scope.timeline = $scope.timeline.concat(data)
    })
  }

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
        $scope.updateTimeline($scope.timeline[$scope.timeline.length - 1]['timestamp'])
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
        $scope.updateTimeline($scope.timeline[$scope.timeline.length - 1]['timestamp'])
      })
    }
    else {
      alert("Must specify Subject, Body and To.")
    }
  }

  $scope.invalidStatus = function () {
    data = {};
    data.id = $scope.ticket.id;
    data.status = 'INVALID';
    TicketApi.update(data, function (data) {
                $scope.ticket = data
              }, function (errorData) {
                  console.log(errorData);
              });
  };

  $scope.getSelectedEmail = function(item) {
    console.log(item);
    return item.email + ","
  };
  $scope.getSelectedMention = function(item) {
    console.log(item);
    return "<span style='color: #4DC5EA;'>"+"@"+item.name+"</span>";
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

  $scope.acknowledgeTicket = function(){
    data = {};
    data.ticket_id = $scope.ticket.id;
    data.assignment_id = $scope.ticket.assignment_details.assignment_id
    data.action = 'ACKNOWLEDGE';
    console.log($scope.ticket, data);
    AssignmentActionApi.save(data, function(data) {
      $scope.ticket = data
    }, function (errorData) {
      console.log(errorData);
    });
  };

  $scope.denyAssignment = function(){
    data = {
      ticket_id: $scope.ticket.id,
      action: "DENY",
      assignment_id: $scope.ticket.assignment_details.assignment_id
    }
    console.log($scope.data.comment, $scope.data.denial_reason)
    if (($scope.data.comment != "") && ($scope.data.denial_reason.length === 1)){
      data.deny_comment = $scope.data.comment;
      data.deny_reason = $scope.data.denial_reason[0]['name']
      AssignmentActionApi.save(data, function(data){
        $scope.data.comment = ""
        $scope.data.denial_reason = []
        $scope.ticket = data
        $scope.data.showDenyCommenter = false
      })
    }
  }
  $scope.removeModal = function(){
    $scope.data.showResolveMailer = false
    $scope.data.showDenyCommenter = false
  }

  $scope.saveTicketDetails = function() {
    console.log("here")
     var data = {};
              data.id = $scope.ticket.id;
              var items = ['owner', 'ownerTeam', 'reassignedTeam', 'reassigned']
              var mapping = {
                owner:'set_owner_member',
                ownerTeam:'set_owner_team',
                reassignedTeam: 'assign_to_team',
                reassigned: 'assign_to_member'
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
                $scope.ticket = data
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
                $scope.updateTimeline($scope.timeline[$scope.timeline.length - 1]['timestamp'])
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

}]);
