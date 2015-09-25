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
  'Flash',
  'transitNew',
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
    AssignmentActionApi,
    Flash,
    transitNew){
  headingService.pageHeading.value = 'Issue Details'
  $scope.data = $scope.data ? $scope.data : {};
  transitNew.data.showCuration(0)
  var pages = ['all_issues', 'my_issues', 'my_team_issues'];
  $scope.data.sentiments = [
              {name : 'Happy'},
              {name : 'Neutral'},
              {name : 'Angry'}
            ];
  var items = ['product', 'sentiment', 'type', 'source', 'owner',
                'reassigned', 'reassignedTeam', 'ownerTeam', 'tags']
  for (i=0;i<items.length; i++){
    $scope[items[i]] = [];
  }

  for(var i=0; i<pages.length; i++){
    ////console.log(ticketFilterService.filters[pages[i]])
    if (ticketFilterService.filters[pages[i]] == 1)
      $scope.data.previousPage = pages[i].replace('_', " ")
  }
  $scope.data.denyReasons = [{name:'Need_more_Info'}, {name:'False_Alarm'}, {name:'Wrong_Team'},
      {name:'Wrong_Type'}, {name:'Other_Reason'}]

  $scope.msToTime = function(duration) {
    var hours = parseInt((duration/(1000*60*60)));
    hours = (hours < 10 && hours > -10) ? "0" + hours : hours;
    return hours;
  };

  $scope.go = function(path) {
    $location.path(path);
  };

  //after getting updated ticket data. by calling this function it will update changes
  $scope.updateData = function(data){
    for( i in $scope.data.types ){
      currentType = $scope.data.types[i];
      if(currentType.name == data.type) {
        currentType.ticked = true;
        $scope.data.type = currentType;
      }
      else{
        currentType.ticked = false;
      }
    }
    //set source
    for( i in $scope.data.sources ){
      currentSource = $scope.data.sources[i];
      if(currentSource.name == data.source) {
        currentSource.ticked = true;
        $scope.data.source = currentSource;
      }
      else{
         currentSource.ticked = false;
      }
    }
    //set product
    for( i in $scope.data.products ){
      currentProduct = $scope.data.products[i];
      if(currentProduct.name == data.product) {
        currentProduct.ticked = true;
        $scope.data.product = currentProduct;
      }
      else{
        currentProduct.ticked = false;
      }
    }
    //set sentiments
    for( i in $scope.data.sentiments ){
      currentSentiment = $scope.data.sentiments[i];
      if(currentSentiment.name == data.sentiment){
        currentSentiment.ticked = true;
        $scope.data.sentiment = currentSentiment;
      }
      else{
        currentSentiment.ticked = false;
      }
    }
    //set owner team
    if (data.owner_details && data.owner_details.team){
      for( i in $scope.data.ownerTeams ){
        currentOwnerTeam = $scope.data.ownerTeams[i];
        if(currentOwnerTeam.name == data.owner_details.team.name) {
          currentOwnerTeam.ticked = true;
          $scope.data.ownerTeam = currentOwnerTeam;
          $scope.getOwnerTeamMembers(currentOwnerTeam, data.owner_details.member);
        }
        else{
          currentOwnerTeam.ticked = false;
        }
      }
    }
    //set reassigned team
    if (data.assignment_details && data.assignment_details.team) {
      for( i in $scope.data.reassignedTeams ){
        currentReassignedTeam = $scope.data.reassignedTeams[i];
        if(currentReassignedTeam.name == data.assignment_details.team.name) {
          currentReassignedTeam.ticked = true;
          $scope.data.reassignedTeam = currentReassignedTeam;
          $scope.getReassignedTeamMembers(currentReassignedTeam, data.assignment_details.member);
        }
        else{
          currentReassignedTeam.ticked = false;
        }
      }
    }
    //enable owner permissions
    if(data.owner_details && data.owner_details.member && Util.getLoggedInUserId() == data.owner_details.member.user.id) {
      $scope.data.isOwner = true;
    }
    else{
      $scope.data.isOwner = false;
    }
    //enable assignee permissions
    if(data.assignment_details && data.assignment_details.member && Util.getLoggedInUserId() == data.assignment_details.member.user.id) {
      $scope.data.isAssigned = true;
    }
    else{
      $scope.data.isAssigned = false;
    }
  }

  TicketApi.get({id:$routeParams.id}, function(data){
    $scope.data.ticket = data
    $scope.data.followUpOf = data.child_of;
    date = new Date(data.created_on * 1000)
    $scope.data.created_on = date.toString();
    $scope.data.isOwner = false;
    $scope.data.isAssigned = false;
    $scope.updateData(data);
    diffrence = 0;
    if( data.created_on){
      currentTimeInMilliSeconds = Date.now();
      if (data.sla){
        slaTimeInMilliSeconds = data.sla * 60 * 60 * 1000;
        diffrence = slaTimeInMilliSeconds - (currentTimeInMilliSeconds - data.created_on * 1000);
      }
    }
    $scope.data.dueTime = $scope.msToTime(diffrence);
  });

  TicketTagApi.get({ticket_id: $routeParams.id},
    function(data){
      var tags = data.tags;
      $scope.data.tagsData = [];
      ////console.log("tags");
      ////console.log(data);
      $scope.data.tags = [];
      if (tags != []){
        for (var i=0; i<tags.length; i++){
          $scope.data.tags.push({text:tags[i]});
          $scope.data.tagsData.push(tags[i]);
        }
      }
    }, function(data){
    ////console.log("TicketTag Error");
  });

  TicketTimelineApi.query({id:$routeParams.id}, function(data){
    //console.log("time line data is ",data);
    for(var i=0; i< data.length; i++){
      var date = new Date(data[i]['timestamp'] * 1000)
      data[i]['date'] = date.toString()
    }
    $scope.data.timeline = data
  })

  $scope.updateTimeline = function(timestamp){
    var data = {
      id:$routeParams.id,
      timestamp:timestamp + 1
    };
    TicketTimelineApi.query(data, function(data){
      for(var i=0; i< data.length; i++){
        date = new Date(data[i]['timestamp'] * 1000)
        data[i]['date'] = date.toString()
      }
      $scope.data.timeline = $scope.data.timeline.concat(data)
      $("body").animate({
        scrollTop: $("#timeline")[0].scrollHeight
      }, 750);
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
    ////console.log($scope.data.comment)
    if (($scope.data.comment != "") && ($scope.data.comment.length > 10)){
      data = {
        ticket_id : $scope.data.ticket.id,
        body: $scope.data.comment
      }
      TicketCommentsListApi.save(data, function(data){
        $scope.data.comment = ""
        $scope.hideAll()
        Flash.create('success', "Comment Added Successfully!!!");
        if ($scope.data.timeline.length > 0)
        $scope.updateTimeline($scope.data.timeline[$scope.data.timeline.length - 1]['timestamp'])
        else
        $scope.updateTimeline(0)
      })
    }
    else {
      alert('htmlVariable must be greater than 10 chars;')
    }
  }
  $scope.addMail = function(){
    ////console.log($scope.data)
    if (($scope.data.subject != "") && ($scope.data.to != "") && ($scope.data.mail !="")){
      data = {
        id : $scope.data.ticket.id,
        body: $scope.data.mail,
        recipient: $scope.data.to,
        subject: $scope.data.subject
      }
      TicketMailsApi.save(data, function(data){
        $scope.data['mail'] = "";
        $scope.data['subject'] = "";
        $scope.data['to'] = "";
        Flash.create('success', "Mail Sent Successfully!!!");
        $scope.hideAll()
        if ($scope.data.timeline.length > 0)
        $scope.updateTimeline($scope.data.timeline[$scope.data.timeline.length - 1]['timestamp'])
        else
        $scope.updateTimeline(0)
      })
    }
    else {
      alert("Must specify Subject, Body and To.")
    }
  }

  $scope.invalidStatus = function () {
    data = {};
    data.id = $scope.data.ticket.id;
    data.status = 'INVALID';
    TicketApi.update(data, function (data) {
                $scope.data.ticket = data
                Flash.create('success', "Status Changed to Invalid");
                if ($scope.data.timeline.length > 0)
                $scope.updateTimeline($scope.data.timeline[$scope.data.timeline.length - 1]['timestamp'])
                else
                $scope.updateTimeline(0)
              }, function (errorData) {
                  ////console.log(errorData);
              });
  };

  $scope.getSelectedEmail = function(item) {
    ////console.log(item);
    return item.email + ","
  };
  $scope.getSelectedMention = function(item) {
    ////console.log(item);
    return "<span style='color: #4DC5EA;' id='"+item.id+"'>"+"@"+item.name+"</span>";
  };
  $scope.searchPeople = function(term) {
    if (term.length > 3){
      UserApi.get({ query: term}, function (data) {
        $scope.data.items = data.users;
      }, function (data) {
        ////console.log(data);
      });
    }
  };
  $scope.pressResolve = function(){
    $scope.data.showResolveMailer = true;
    $scope.data.send_custom_mail = true;
    ////console.log("resolve")
  }
  $scope.pressDeny = function(){
    $scope.data.showDenyCommenter = true;
    ////console.log("deny")
  }
  $scope.resolveTicket = function(){
    data = {id: $scope.data.ticket.id, status : "RESOLVED"}
    if ($scope.data.send_custom_mail === true){
      data.send_custom_mail = 1;
      TicketApi.update(data, function(data){
        $scope.data.ticket = data
        $scope.data.showResolveMailer = false;
        Flash.create('success', "Status Changed to Resolve");
        if ($scope.data.timeline.length > 0)
        $scope.updateTimeline($scope.data.timeline[$scope.data.timeline.length - 1]['timestamp'])
        else
        $scope.updateTimeline(0)
      })
    }
    else {
      if  (($scope.data.subject != "") && ($scope.data.to != "") && ($scope.data.mail !="")){
        data.send_custom_mail = 0
        data.subject = $scope.data.subject
        data.body = $scope.data.mail
        data.recipient = $scope.data.to
        TicketApi.update(data, function(data){
          ////console.log(data)
          $scope.data['mail'] = "";
          $scope.data['subject'] = "";
          $scope.data['to'] = "";
          $scope.data.ticket = data
          $scope.data.showResolveMailer = false;
          Flash.create('success', "Status Changed to Resolve");
          if ($scope.data.timeline.length > 0)
          $scope.updateTimeline($scope.data.timeline[$scope.data.timeline.length - 1]['timestamp'])
          else
          $scope.updateTimeline(0)
        })
      }
      else {
        alert("Must specify Subject, Body and To.")
      }
    }
  }

  $scope.acknowledgeTicket = function(){
    data = {};
    data.ticket_id = $scope.data.ticket.id;
    data.assignment_id = $scope.data.ticket.assignment_details.assignment_id
    data.action = 'ACKNOWLEDGE';
    ////console.log($scope.data.ticket, data);
    AssignmentActionApi.save(data, function(data) {
      $scope.data.ticket = data
      $scope.updateData(data);
      Flash.create('success', "Assignment Acknowledged");
      if ($scope.data.timeline.length > 0)
      $scope.updateTimeline($scope.data.timeline[$scope.data.timeline.length - 1]['timestamp'])
      else
      $scope.updateTimeline(0)
    }, function (errorData) {
      ////console.log(errorData);
    });
  };

  $scope.denyAssignment = function(){
    data = {
      ticket_id: $scope.data.ticket.id,
      action: "DENY",
      assignment_id: $scope.data.ticket.assignment_details.assignment_id
    }
    if (($scope.data.comment != "") && ($scope.data.denial_reason.length === 1)){
      data.deny_comment = $scope.data.comment;
      data.deny_reason = $scope.data.denial_reason[0]['name']
      AssignmentActionApi.save(data, function(data){
        $scope.data.comment = ""
        $scope.data.denial_reason = []
        $scope.data.ticket = data
        $scope.updateData(data);
        Flash.create('success', "Assignment Denied!!!");
        $scope.data.showDenyCommenter = false
        //console.log("time line got is", $scope.data.timeline);
        if ($scope.data.timeline.length > 0)
        $scope.updateTimeline($scope.data.timeline[$scope.data.timeline.length - 1]['timestamp'])
        else
        $scope.updateTimeline(0)
      })
    }
  }
  $scope.removeModal = function(){
    $scope.data.showResolveMailer = false
    $scope.data.showDenyCommenter = false
  }

  $scope.saveTicketDetails = function() {
    ////console.log("here")
    var data = {};
    data.id = $scope.data.ticket.id;
    //check owner team  if changed then send it in data
    if($scope.data['ownerTeam'].length){
      if($scope.data['ownerTeam'][0].id != $scope.data.ticket.owner_details.team.id){
        data['set_owner_team'] = $scope.data['ownerTeam'][0].id;
      }
    }

    //check owner  if changed then send it in data
    if($scope.data['owner'] && $scope.data['owner'].length){
      if($scope.data['owner'][0].id != $scope.data.ticket.owner_details.member.id){
        data['set_owner_member'] = $scope.data['owner'][0].id;
      }
    }

    //check assigned team changed if changed then send it in data
    if ($scope.data['reassignedTeam'] && $scope.data['reassignedTeam'].length){
      if($scope.data['reassignedTeam'][0].id != $scope.data.ticket.assignment_details.team.id){
        data['assign_to_team'] = $scope.data['reassignedTeam'][0].id;
      }
    }

    //check assignee changed if changed then send it in data
    if($scope.data['reassigned'] && $scope.data['reassigned'].length){
      if($scope.data['reassigned'][0].id != $scope.data.ticket.assignment_details.member.id){
        data['assign_to_member'] = $scope.data['reassigned'][0].id;
      }
    }

    if ($scope.data.followUpOf && $scope.data.followUpOf != $scope.data.ticket['child_of']) {
      data.set_followup_of = $scope.data.followUpOf;
    }

    var dataTags = [];
    for (i=0; i<$scope.data.tags.length; i++){
      if($scope.data.tagsData.indexOf($scope.data.tags[i].text) == -1){
        dataTags.push($scope.data.tags[i].text);
      }
    }
    if(dataTags.length > 0){
      data.tags = dataTags;
    }
    ////console.log("save query data is ", data);
    if(Object.keys(data).length > 1){
      TicketApi.update(data, function(data) {
          $scope.data.ticket = data
          $scope.updateData(data);
          Flash.create('success', "Ticket Details Saved!!!")
          if ($scope.data.timeline.length > 0)
              $scope.updateTimeline($scope.data.timeline[$scope.data.timeline.length - 1]['timestamp'])
          else
              $scope.updateTimeline(0)
      }, function(errorData) {
          ////console.log(errorData);
      });
    }
    else{
      Flash.create('danger', "No change in ticket data");
    }
};

   $scope.getOwnerTeamMembers = function(data, memberInfo){
    memberInfo = typeof memberInfo !== 'undefined' ? memberInfo : false;
    TeamMembersListApi.get({team_id : data.id}, function (data){
      for( i in data.members) {
        member = data.members[i];
        member.name = member.user.name;
      }
      $scope.data.ownerTeamMembers = data.members;
      if (memberInfo) {
        for( i in $scope.data.ownerTeamMembers){
          ownerTeamMember =  $scope.data.ownerTeamMembers[i];
          if(memberInfo.id == ownerTeamMember.id){
            ownerTeamMember.ticked = true;
            $scope.data.owner = ownerTeamMember;
          }
        }
      }
    }, function (errorData){
      $scope.data.ownerTeamMembers = [];
    });
  };

  $scope.getReassignedTeamMembers = function(data, memberInfo ){
    TeamMembersListApi.get({team_id : data.id}, function (data){
      for( i in data.members) {
        member = data.members[i];
        member.name = member.user.name;
      }
      $scope.data.reassignedTeamMembers = data.members;
      if (memberInfo) {
        for( i in $scope.data.reassignedTeamMembers){
          reassignedTeamMember =  $scope.data.reassignedTeamMembers[i];
          if(memberInfo.id == reassignedTeamMember.id){
            reassignedTeamMember.ticked = true;
            $scope.data.reassigned = reassignedTeamMember;
          }
        }
      }
    }, function (errorData){
      $scope.data.reassignedTeamMembers = [];
    });
  };

}]);
