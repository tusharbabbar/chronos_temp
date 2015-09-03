angular.module('chronos').controller('LoginCtrl', function($scope, LoginApi){
  $scope.email = '',
  $scope.password = '',

  $scope.signin = function(){
    console.log('here')
    if ($scope.email && $scope.password) {
      LoginApi.post($scope.email, $scope.password);
    }
  }
})
