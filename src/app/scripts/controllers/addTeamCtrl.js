angular.module('chronos').controller('addTeamCtrl',
  [ '$scope',
    'headingService',
    'TeamsListApi',
    'TeamLevelsListApi',
    'LevelMembersListApi',
    'LevelMembersApi',
    'TeamApi',
    'UserApi',
    'Flash',
    'Meta',
     function($scope,
     headingService,
     TeamsListApi,
     TeamLevelsListApi,
     LevelMembersListApi,
     LevelMembersApi,
     TeamApi,
     UserApi,
     Flash,
     Meta){

    headingService.pageHeading.value = 'Configurations';
    $scope.data = {}
    //get teams
    $scope.getTeams = function(){
      TeamsListApi.get( {all : 1}, function (data) {
          $scope.data.teams = data.teams;
      });
    };
    $scope.getTeams();

    $scope.addTeam = function(){
      if(!$scope.team){
        Flash.create("danger", "Team field can not be null");
        return;
      }
      if(!$scope.type){
        Flash.create("danger", "Select Team type");
        return;
      }
      TeamsListApi.save({name : $scope.team, type : $scope.type}, function(data){
        $scope.team = "";
        $scope.type = "";
        $scope.data.teams.push(data.team);
      });
    };

    $scope.showTeam = function(team){
      for(i in $scope.data.teams){
          $scope.data.teams[i].showDetail = false;
      }
      data = {}
      data.id = team.id;
      TeamApi.get(data, function(data){
          team.levels = data.levels;
          team.showDetail = true;
      });
    }

    var updateTeamInfo = function(level, team){
      if(level.is_default){
        if(team.type)
          Meta.refreshOwnerTeams();
        else
          Meta.refreshAssignedTeams();
      }
    }
    $scope.removeMember = function(member, memberIndex, level, team){
      data = {};
      data.id = member.member_id;
      data.active = 0;
      LevelMembersApi.update(data, function(data){
        level.members.splice(memberIndex, 1);
      });
      updateTeamInfo(level, team);
    }

    $scope.addLevel = function(id, sla, team){
      if(!sla){
        Flash.create("danger", "SLA Required");
        return;
      }
      data = {};
      data.team_id = id;
      data.sla_policy = sla;
      TeamLevelsListApi.save(data, function(data){
        team.levels = data.levels;
        team.showDetail = true;
      });
    };

    $scope.searchUser = function(term) {
      if (term.length > 3){
        UserApi.get({ query: term}, function (data) {
          $scope.data.items = data.users;
        });
      }
    };

    $scope.addUser = function(item, level, team) {
      data = {};
      data.team_id = team.id;
      data.level_id = level.id;
      data.user_id = item.id;
      LevelMembersListApi.save(data, function(data){
        team.levels = data.levels;
        team.showDetail = true;
        $scope.data.items ="";
      });
      updateTeamInfo(level, team);
      return "";
    };
}]);
