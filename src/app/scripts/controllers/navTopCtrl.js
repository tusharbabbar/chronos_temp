angular.module('chronos').controller('navTopCtrl',['$scope', 'headingService', function($scope, headingService){
  $scope.pageHeading = headingService.pageHeading
}])
