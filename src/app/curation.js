angular.module('chronos').controller('curationCtrl',
  [ '$scope',
    '$window',
    'ticketCurationService',
    'UserApi',
    'SourcesListApi',
    'ProductsListApi',
    'TypesListApi',
    'TeamsListApi',
    'TeamMembersListApi',
    'TicketTagApi',
    'TicketCommentsListApi',
    'TicketApi',
    'ticketFilterService',
    'Flash',
    'transitNew',
     function ($scope,
      $window,
      ticketCurationService,
      UserApi,
      SourcesListApi,
      ProductsListApi,
      TypesListApi,
      TeamsListApi,
      TeamMembersListApi,
      TicketTagApi,
      TicketCommentsListApi,
      TicketApi,
      ticketFilterService,
      Flash,
    transitNew) {
            //default
            $scope.data = {}
            $scope.singleSelectSetting = {selectionLimit: 1};
            $scope.data.statustesLength = 2;
            $scope.comments = [];
            $scope.data.showComment = false;
            $scope.sentiments = [
              {name : 'Happy'},
              {name : 'Neutral'},
              {name : 'Angry'}
            ];
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
            TeamsListApi.get( {if_owner : 1, with_members : 1}, function (data) {
              $scope.ownerTeams = data.teams;
            });
            //get list of assigned teams
            TeamsListApi.get( {all : 1, with_members : 1}, function (data) {
              $scope.assignedTeams = data.teams;
              console.log($scope.assignedTeams);
            });
            $scope.capitalizeFirstLetter = function toTitleCase(string){
                return string[0].toUpperCase() + string.slice(1);
            };


            //reset all set values
            $scope.reset = function(){
              //reset owner team
              for(i in $scope.ownerTeams){
                $scope.ownerTeams[i].ticked = false;
              }

              // reset owner
              for(i in $scope.assignedTeams){
                $scope.assignedTeams[i].ticked = false;
              }
            }

            //get ticket detail
            $scope.showTicket = function() {
              $scope.reset();
              $scope.statuses = [
                {name : 'RESOLVED'},
                {name : 'INVALID'}
              ];
              var items = ['product', 'status', 'sentiment', 'type', 'source', 'owner',
                'assigned', 'assignedTeam', 'ownerTeam', 'tags']
              for (i=0;i<items.length; i++){
                $scope[items[i]] = [];
              }
              $scope.ticketId = ticketCurationService.getTicketId();

              TicketApi.get( {id : $scope.ticketId} , function(data){
                console.log("ticket data is as", data);
                //saving current ticket data
                $scope.ticketData = data;
                $scope.ticketData.ownerTeam = {};
                $scope.ticketData.owner = {};
                $scope.ticketData.assignedTeam = {};
                $scope.ticketData.assigned = {};
                $scope.data.ticketDescription = data.description;
                $scope.data.ticketId = data.id;
                $scope.data.followUpOf = data.child_of;

                //set status
                if( ! (data.status == "RESOLVED" || data.status == "INVALID") ) {
                    if($scope.statuses.length == $scope.data.statustesLength){
                      $scope.statuses.push({name : data.status});
                    }
                    else{
                      $scope.statuses[$scope.data.statustesLength] = {name : data.status};
                    }
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
                  $scope.ticketData.ownerTeam = data.owner_details.team;
                  $scope.ticketData.owner = data.owner_details.member;
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
                  $scope.ticketData.assignedTeam =  data.assignment_details.team;
                  $scope.ticketData.assigned = data.assignment_details.member;
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

                TicketTagApi.get({ticket_id: $scope.ticketId}, function(data){
                    var tags = data.tags;
                    $scope.tagsData = [];
                    console.log("tags");
                    console.log(data);
                    $scope.tags = [];
                    if (tags != []){
                      for (var i=0; i<tags.length; i++){
                        $scope.tags.push({text:tags[i]});
                        $scope.tagsData.push(tags[i]);
                      }
                    }
                  }, function(data){
                  console.log("TicketTag Error");
                });

                //get ticket comments
                TicketCommentsListApi.query({ticket_id:$scope.ticketId}, function(data){
                  for(var i=0; i< data.comments.length; i++){
                    var date = new Date(data.comments[i]['created_on'] * 1000)
                    data.comments[i]['date'] = date.toString()
                  }
                  $scope.comments = data.comments;
                });

              });
            };
            $scope.updateComments = function(){
              $scope.comments = []
              TicketCommentsListApi.query({ticket_id:$scope.ticketId}, function(data){
                for(var i=0; i< data.comments.length; i++){
                  var date = new Date(data.comments[i]['created_on'] * 1000)
                  data.comments[i]['date'] = date.toString()
                }
                $scope.comments = data.comments;
                $("#ticket-description").animate({scrollTop: $("#ticket-description")[0].scrollHeight + 10000}, 750)
              });
            }
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
                      $scope.owner[0] = ownerTeamMember;
                    }
                    else{
                      ownerTeamMember.ticked = false;
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
                      $scope.assigned[0] = assignedTeamMember;
                    }
                    else{
                       assignedTeamMember.ticked = false;
                    }
                  }
                }
              }, function (errorData){
                $scope.assignedTeamMembers = [];
              });
            };

            $scope.mail = {
              'send_default_mail' : true,
              'subject' : '',
              'body' : '',
              'to' : '',
              'do_not_sendmail' : false,
            };

            $scope.checkSave = function(){

                if($scope['assignedTeam'].length ){
                  $scope.data.showCustomMail = true;
                }
                else{
                  $scope.save();
                }
            };

            $scope.removeModal = function(){
              $scope.data.showCustomMail = false;
            };

            $scope.save = function() {
              var data = {};
              if($scope.data.showCustomMail){
                  if( $scope.mail.do_not_sendmail == true){
                    console.log("do not send mail");
                    $scope.data.showCustomMail = false;
                  }
                  else if ($scope.mail.send_default_mail === true){
                    console.log("default mail sent");
                    data.send_custom_mail = 1;
                  }
                  else {
                    if  (($scope.mail.subject != "") && ($scope.mail.to != "") && ($scope.mail.body !="")){
                      console.log("custom mail send");
                      data.send_custom_mail = 0;
                      data.subject = $scope.mail.subject;
                      data.body = $scope.mail.body;
                      data.recipient = $scope.mail.to;
                    }
                    else {
                      alert("Must specify Subject, Body and To.")
                      return;
                    }
                  }
              }
              data.id = $scope.ticketId;
              var items = ['product', 'type', 'source']
              var mapping = {
                product:'product_id',
                type:'type_id',
                source:'source_id'
              }
              for(var i=0; i<items.length; i++){
                if ($scope[items[i]].length && $scope[items[i]][0].name != $scope.ticketData[items[i]]) {
                  console.log("changed item is ", items[i]);
                  data[mapping[items[i]]] = $scope[items[i]][0].id;
                }
              }

              //check owner team  if changed then send it in data
              if ($scope['ownerTeam'].length){
                if($scope['ownerTeam'][0].id != $scope.ticketData.ownerTeam.id){
                  data['set_owner_team'] = $scope['ownerTeam'][0].id;
                }
              }

              //check owner  if changed then send it in data
              if($scope['owner'].length){
                if($scope['owner'][0].id != $scope.ticketData.owner.id){
                  data['set_owner_member'] = $scope['owner'][0].id;
                }
              }

              //check assigned team changed if changed then send it in data
              if ($scope['assignedTeam'].length){
                if($scope['assignedTeam'][0].id != $scope.ticketData.assignedTeam.id){
                  data['assign_to_team'] = $scope['assignedTeam'][0].id;
                }
              }

              //check assignee changed if changed then send it in data
              if($scope['assigned'].length){
                if($scope['assigned'][0].id != $scope.ticketData.assigned.id){
                  data['assign_to_member'] = $scope['assigned'][0].id;
                }
              }

              if ($scope.sentiment.length && $scope.sentiment[0].name != $scope.ticketData['sentiment']) {
                data.sentiment = $scope.sentiment[0].name;
              }
              console.log("current stats is ", $scope.status);
              if ($scope.status[0].name === 'INVALID' || $scope.status[0].name === 'RESOLVED') {
                console.log("status got");
                data.status = $scope.status[0].name;
              }

              if ($scope.followUpOf && $scope.followUpOf != $scope.ticketData['child_of']) {
                data.set_followup_of = $scope.followUpOf;
              }

              var dataTags = [];
              for (i=0; i<$scope.tags.length; i++){
                if($scope.tagsData.indexOf($scope.tags[i].text) == -1){
                  dataTags.push($scope.tags[i].text);
                }
              }
              if(dataTags.length > 0){
                data.tags = dataTags;
              }
              if(Object.keys(data).length > 1){
                 TicketApi.update(data, function (data) {
                  console.log(data)
                  $scope.mail.body = "";
                  $scope.mail.subject = "";
                  $scope.mail.to = "";
                  $scope.data.showCustomMail = false;
                  transitNew.data.showCuration(0);
                  Flash.create('success', "Ticket Saved Successfully!!!");
                  ticketFilterService.update_tickets_with_filters()
                }, function (errorData) {
                    console.log(errorData);
                });
              }
              else{
                $scope.data.showCustomMail = false;
                transitNew.data.showCuration(0);
                Flash.create('danger', "No change in ticket data");
              }
            };
            //close curation screen
            $scope.cancel = function() {
              transitNew.data.showCuration(0);
            };

            //search user from users api for mention
            $scope.searchPeople = function(term) {
              console.log(term)
              if (term.length > 3){
                UserApi.get({ query: term}, function (data) {
                  console.log(data)
                  $scope.items = data.users;
                }, function (data) {
                  console.log(data);
                });
              }
            };
            //select user for mention
            $scope.getSelectedUser = function(item) {
              console.log(item);
              return "<span style='color: #4DC5EA;' id='"+item.id+"'>"+"@"+item.name+"</span>";
            };

            //select user email
            $scope.getSelectedEmail = function(item) {
              console.log(item);
              return item.email + ","
            };

            //add comment on ticket
            $scope.data.comment = ""
            $scope.addComment = function(){
              console.log($scope.data.comment)
              if (($scope.data.comment != "") && ($scope.data.comment.length > 10)){
                data = {
                  ticket_id : $scope.ticketId,
                  body: $scope.data.comment
                }
                TicketCommentsListApi.save(data, function(data){
                  $scope.data.comment = "";
                  $scope.toggleComment()
                  $scope.updateComments()
                  Flash.create('success', "Comment Added Successfully!!!");
                }, function(errorData){
                  console.log(errorData);
                });
              }
              else {
                alert('htmlVariable must be greater than 10 chars;')
              }
            };

            //hide comment box
            $scope.toggleComment = function(){
              $scope.data.showComment = !$scope.data.showComment;
            }
}]);
