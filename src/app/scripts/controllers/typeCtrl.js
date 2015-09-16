'use strict';

angular.module('chronos').controller('TypeCtrl', function ($scope, TypesListApi, TypeApi) {
  $scope.Heading = 'Types';
  var types = TypesListApi.get();
  types.$promise.then(function (data) {
    $scope.types = data.types;
  });
  $scope.changeStatus = function (_type) {
    TypeApi.update({ id: _type.id }, { 'active': !_type.active }, function (data) {
      _type.active = !_type.active;
      $scope.name='';
      $scope.sla='';
    }, function (data) {
      console.log(data);
      window.alert('cannot complete request');
    });
  };
  $scope.addType = function (name, sla) {
    TypesListApi.save({ 'name': name, 'sla': sla }, function (data) {
      $scope.types.push(data.type);
      $scope.name = null;
      $scope.sla = null;
      console.log("scope set to null");
    }, function (data) {
      console.log(data);
    });
  };
  $scope.submit = function(event) {
    if(event.charCode == 13){
        if($scope.name && $scope.sla){
            $scope.addType($scope.name, $scope.sla);
        }
    }
  };
});
