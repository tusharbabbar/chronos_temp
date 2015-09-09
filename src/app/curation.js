angular.module('chronos').controller('curationCtrl', 
  [ '$scope', 'SourcesListApi', 'ProductsListApi', 'TypesListApi', 'TeamsListApi',
    'TeamMembersListApi', 'TicketTagApi', 'TicketCommentsListApi', 'TicketApi',
     function ($scope, SourcesListApi, ProductsListApi, TypesListApi, TeamsListApi, TeamMembersListApi, TicketTagApi, TicketCommentsListApi, TicketApi) {
            var ticketId = 2;
            //default 
            $scope.singleSelectSetting = {selectionLimit: 1};
            $scope.statuses = [
              {name : 'RESOLVED'},
              {name : 'INVALID'}
            ];
            console.log($scope.statuses);
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
            TeamsListApi.get( {if_owner : true}, function (data) {
              $scope.ownerTeams = data.teams;
            });
            //get list of assigned teams
            TeamsListApi.get( {if_assigned : true}, function (data) {
              $scope.assignedTeams = data.teams;
            });
            //get ticket detail
            TicketApi.get( {id : ticketId} , function(data){
                $scope.ticketDescription = data.description;
                $scope.ticketId = data.id;
                $scope.ticketCreatedOn = data.created_on;
                $scope.ticketCreator = data.created_by.name;
                $scope.childOf = data.child_of;
                $scope.val = data;
                console.log("ticket data");
                console.log(data);           
                //set status
                if( ! (data.status == "RESOLVED" || data.status == "INVALID") ) {
                  $scope.statuses.push({name : data.status});  
                }
                for( i in $scope.statuses ){
                  currentStatus = $scope.statuses[i];
                  if(currentStatus.name === data.status) {
                    currentStatus.ticked = true;
                    $scope.status.push(currentStatus);
                  }
                }
                //set type
                for( i in $scope.types ){
                  currentType = $scope.types[i];
                  if(currentType.name == data.type) {
                    currentType.ticked = true;
                    $scope.type.push(currentType);
                  }
                }    
                //set source
                for( i in $scope.sources ){
                  currentSource = $scope.sources[i];
                  if(currentSource.name == data.source) {
                    currentSource.ticked = true;
                    $scope.source.push(currentSource);
                  }
                }      
                //set product
                for( i in $scope.products ){
                  currentProduct = $scope.products[i];
                  if(currentProduct.name == data.product) {
                    currentProduct.ticked = true;
                    $scope.product.push(currentProduct);
                  }
                }
                //set owner team
                if (data.owner_details && data.owner_details.team){
                  for( i in $scope.ownerTeams ){
                    currentOwnerTeam = $scope.ownerTeams[i];
                    if(currentOwnerTeam.name == data.owner_details.team.name) {
                      currentOwnerTeam.ticked = true;
                      $scope.ownerTeam.push(currentOwnerTeam);
                      $scope.getOwnerTeamMembers(currentOwnerTeam, data.owner_details.member);
                    }
                  }
                }
                //set assigned team
                if (data.assignment_details && data.assignment_details.team) {
                  for( i in $scope.assignedTeams ){
                    currentAssignedTeam = $scope.assignedTeams[i];
                    if(currentAssignedTeam.name == data.assignment_details.team.name) {
                      currentAssignedTeam.ticked = true;
                      $scope.assignedTeam.push(currentAssignedTeam);
                      $scope.getAssignedTeamMembers(currentAssignedTeam, data.assignment_details.member);
                    }
                  }
                }   

                TicketTagApi.get({ticket_id: ticketId}, function(data){
                    var tags = data.tags;
                    console.log("tags");
                    console.log(data);
                    if (tags != []){
                      $scope.tags = [];
                      for (var i=0; i<tags.length; i++){
                        $scope.tags.push({text:tags[i]});
                      }
                    }
                  }, function(data){
                  console.log("TicketTag Error");
                });
            });

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

            $scope.save = function() {
              var data = {};
              data.id = $scope.ticketId;
              data.description = $scope.ticketDescription;
              var items = ['product', 'type', 'source', 'owner', 'assigned', 'assignedTeam', 'ownerTeam']
              var mapping = {
                product:'product_id',
                type:'type_id',
                source:'source_id',
                owner:'set_owner_member',
                assigned:'assign_to_member',
                ownerTeam:'set_owner_team',
                assignedTeam:'assign_to_team'
              }
              for(var i=0; i<items.length; i++){
                if ($scope[items[i]].length) {
                  console.log(items[i]);
                  console.log($scope[items[i]]);
                  data[mapping[items[i]]] = $scope[items[i]][0].id;
                }
              }
              console.log("sentiment...");
              console.log($scope.sentiment);
              if ($scope.sentiment) {
                data.sentiment = $scope.sentiment[0].name;
              }

              if ($scope.status.name === 'INVALID' || $scope.status.name === 'RESOLVED') {
                data.status = $scope.status[0].name;
              }

              if ($scope.followUpOf) {
                data.set_followup_of = $scope.followUpOf;
              }
              var dataTags = [];
              for (i=0; i<$scope.tags.length; i++){
                dataTags.push($scope.tags[i].text);
              }
              data.tags = dataTags;
              console.log("data sent is ");
              console.log(data);
              TicketApi.update(data, function (data) {
                console.log("ticket updated");
                //save ticket comment 
                if ($scope.comment) {
                  console.log($scope.comment);
                  TicketCommentsListApi.save({ticket_id : $scope.ticketId, body : $scope.comment}, function(data){
                    console.log(data);
                  }, function (errorData) {
                    console.log(errorData);
                  });
                }
              }, function (errorData) {
                  console.log(errorData);
              });

            };
            $scope.cancel = function() {
              //cancel action
              console.log($scope.tags);
            };
}]);