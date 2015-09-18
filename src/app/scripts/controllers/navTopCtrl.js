angular.module('chronos').controller('navTopCtrl',['$scope', 'headingService', 'Util', '$location', function($scope, headingService, Util, $location){
  $scope.pageHeading = headingService.pageHeading
  $scope.showLogout = false;
  $scope.logout = function(){
    Util.logoutUser()
    $scope.showLogout = !$scope.showLogout
    $location.path('/login')
  }
  $scope.toggleShowLogout = function(){
    $scope.showLogout = !$scope.showLogout
    console.log($scope.showLogout)
  }
}])
