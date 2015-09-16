'use strict';

angular.module('chronos').controller('TeamCtrl', function ($scope, TeamApi, TeamsListApi) {
    $scope.Heading = 'Teams';
    var teams = TeamsListApi.get();
    teams.$promise.then(function (data) {
        $scope.teams = data.teams;
    });
    $scope.addTeam = function (name) {
        TeamApi.save({'name': name, 'type': type}, function (data) {
            $scope.teams.push(data.team);
        });
    };
});
