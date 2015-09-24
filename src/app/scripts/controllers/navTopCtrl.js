angular.module('chronos').controller('navTopCtrl',['$scope', 'headingService', 'Util', '$location', 'transitNew', function($scope, headingService, Util, $location, transitNew){
  $scope.pageHeading = headingService.pageHeading;
  $scope.showLogout = false;
  $scope.toggleLeftNav = transitNew.data.toggleLeftNav
  $scope.logout = function(){
    Util.logoutUser();
    $scope.showLogout = !$scope.showLogout;
    $location.path('/login');
  };
  $scope.toggleShowLogout = function(){
    $scope.showLogout = !$scope.showLogout;
    console.log($scope.showLogout);
  };
}]);
