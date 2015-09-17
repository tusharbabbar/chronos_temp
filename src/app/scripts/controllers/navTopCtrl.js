angular.module('chronos').controller('navTopCtrl',['$scope', 'headingService', 'Util', function($scope, headingService, Util){
  $scope.pageHeading = headingService.pageHeading
  $scope.showLogout = false;
  $scope.logout = function(){
    Util.logoutUser()
  }
  $scope.toggleShowLogout = function(){
    $scope.showLogout = !$scope.showLogout
  }
}])
