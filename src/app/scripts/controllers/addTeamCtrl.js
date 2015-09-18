angular.module('chronos').controller('addTeamCtrl',
  [ '$scope',
  	'TeamsListApi',
  	'TeamLevelsListApi',
  	'TeamApi',
  	'UserApi',
     function($scope,
     TeamsListApi,
     TeamLevelsListApi,
     TeamApi,
     UserApi){

    //get teams
    TeamsListApi.get( {all : 1}, function (data) {
    		  console.log("data got is ", data);
              $scope.teams = data.teams;
              //get team levels details
              $scope.team_details = [];
			    for(i in $scope.teams){
			    	currentTeam = $scope.teams[i];
			    	data = {};
			    	data.id = currentTeam.id;
			    	TeamApi.get(data, function(data){
			    		$scope.team_details.push(data);
			    	});
			    }
            }, function(errordata){
            	console.log("Failed data is ", errordata);
            });

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
   			console.log("team added successfully");
   		}, function(errorData){
   			console.log(errorData);
   		});
   	};

   	$scope.addLevel = function(id, sla){
   		if(!sla){
   			alert("SLA Required");
   			return;
   		}
   		data = {};
   		data.team_id = id;
   		data.sla_policy = sla;
   		TeamLevelsListApi.save(data, function(data){
   			console.log(data);
   		}, function(errordata){
   			console.log(errordata);
   		});
   	};

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
   	
    $scope.add_level_member = function (level_id, user_id) {
      console.log(level_id, user_id);
      LevelMember.save({
        team_id: $scope.team.id,
        level_id: level_id,
        user_id: user_id
      }, function (data) {
        console.log(data);
        Flash.create('success', 'Member added successfully!!!', 'alertIn', 'ng-animate');
        $scope.team_details = data;
      });
    };
}]);