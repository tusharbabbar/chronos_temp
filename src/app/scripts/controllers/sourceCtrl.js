'use strict';

angular.module('chronos').controller('SourceCtrl', function ($scope, SourceApi, SourcesListApi) {
  $scope.Heading = 'Sources';
  var sources = SourcesListApi.get();
  sources.$promise.then(function(data) {
    $scope.sources = data.sources;
  });
  $scope.changeStatus = function (_source) {
    SourceApi.update({ id: _source.id }, { 'active': !_source.active }, function (data) {
      _source.active = !_source.active;
    }, function (data) {
      window.alert('cannot complete request');
    });
  };
  $scope.addSource = function (name) {
    SourcesListApi.save({ 'name': name }, function (data) {
      $scope.sources.push(data.source);
      $scope.name = null;
    }, function (data) {
      console.log(data);
    });
  };
  $scope.submit = function(event) {
    if(event.charCode == 13){
        if($scope.name){
            $scope.addSource($scope.name);
        }
    }
  };
});
