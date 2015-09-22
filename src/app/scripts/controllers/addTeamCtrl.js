angular.module('chronos').controller('addTeamCtrl',
  [ '$scope',
    'headingService',
    'TeamsListApi',
    'TeamLevelsListApi',
    'LevelMembersListApi',
    'LevelMembersApi',
    'TeamApi',
    'UserApi',
     function($scope,
     headingService,
     TeamsListApi,
     TeamLevelsListApi,
     LevelMembersListApi,
     LevelMembersApi,
     TeamApi,
     UserApi){

    headingService.pageHeading.value = 'Configurations';
    //get teams
    $scope.getTeams = function(){
      TeamsListApi.get( {all : 1}, function (data) {
          console.log("data got is ", data);
          $scope.teams = data.teams;
          console.log("team data is ", $scope.teams);
          //get team levels details
          $scope.team_details = [];
          for(i in $scope.teams){
            currentTeam = $scope.teams[i];
            data = {};
            data.id = currentTeam.id;
            TeamApi.get(data, function(data){
              console.log("each team data is ", data);
              data.showLevels = false;
              $scope.team_details.push(data);
            }, function(errorData){
              console.log(errorData);
            });
          }
      }, function(errordata){
        console.log("Failed data is ", errordata);
      });
    }
    //get teams detail
    $scope.getTeams();

    $scope.addTeam = function(){
      if(!$scope.team){
        alert("Team field can not be null");
        return;
      }
      if(!$scope.type){
        alert("Select Team type");
      }
      TeamsListApi.save({name : $scope.team, type : $scope.type}, function(data){
        $scope.team = "";
        $scope.type = "";
        $scope.getTeams();
      }, function(errorData){
        console.log(errorData);
      });
    };

    $scope.toggle = function(index){
      for(i in $scope.team_details){
        if(i == index){
          $scope.team_details[index].showLevels = !$scope.team_details[index].showLevels;
        }
        else{
          $scope.team_details[i].showLevels = false;
        }

      }
    }

    $scope.removeMember = function(member, memberIndex, levelIndex, teamIndex){
      data = {};
      data.id = member.member_id;
      data.active = 0;
      LevelMembersApi.update(data, function(data){
        $scope.team_details[teamIndex].levels[levelIndex].members.splice(memberIndex, 1);
         console.log("update performed successfully");
      },function(errorData){
        console.log(errorData);
      });
    }

    $scope.addLevel = function(id, sla, index){
      console.log("index get is ", index);
      if(!sla){
        alert("SLA Required");
        return;
      }
      data = {};
      data.team_id = id;
      data.sla_policy = sla;
      TeamLevelsListApi.save(data, function(data){
        data.showLevels = true;
        $scope.team_details[index] = data;
      }, function(errorData){
        console.log(errorData);
      });
    };
    $scope.data = {}
    $scope.searchPeople = function(term) {
    console.log(term);
    if (term.length > 3){
      UserApi.get({ query: term}, function (data) {
        console.log(data)
        $scope.data.items = data.users;
      }, function (data) {
        console.log(data);
      });
    }
  };

  $scope.addUser = function(item, level, team, index) {
    data = {};
    data.team_id = team.id;
    data.level_id = level.id;
    data.user_id = item.id;
    LevelMembersListApi.save(data, function(data){
      data.showLevels = true;
      $scope.team_details[index] = data;
      $scope.items ="";
    }, function(errordata){
      console.log(errordata);
    });
    return "";
  };
  // $scope.add_level_member = function (level_id, user_id) {
  //   console.log(level_id, user_id);
  //   LevelMember.save({
  //     team_id: $scope.team.id,
  //     level_id: level_id,
  //     user_id: user_id
  //   }, function (data) {
  //     console.log(data);
  //     Flash.create('success', 'Member added successfully!!!', 'alertIn', 'ng-animate');
  //     $scope.team_details = data;
  //   });
  // };

}]);
