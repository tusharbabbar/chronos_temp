angular.module('chronos').controller('navTopCtrl',[
  '$scope',
  'headingService',
  'Util',
  '$location',
  'transitNew',
  'Flash',
  'ticketFilterService',
  function(
    $scope,
    headingService,
    Util,
    $location,
    transitNew,
    Flash,
    ticketFilterService){
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
        //console.log($scope.showLogout);
      };

      /**
      * Method used used on mini dashboard,
      * Type: Mandatory with values "new" and "inProgress"
      */
      $scope.showMyTicketList = function(type){
        switch (type){
          case "new":
          ticketFilterService.filters.statuses = [{name:"CURATION"},{name:"ORPHAN"}];
          break;
          case "inProgress":
          ticketFilterService.filters.statuses = [{name:"INPORGRESS"}];
          break;
          default:
          Flash.create('danger', "Invalid ticket type provided");
        }
        // refresh the page if the user is currently on my_issues page else navigate to the page
        if($location.$$path == "/tickets/my_issues"){
          ticketFilterService.update_tickets_with_filters();
        }else{
          $location.path('/tickets/my_issues');
        }
      }
    }]);
