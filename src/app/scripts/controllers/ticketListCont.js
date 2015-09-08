angular.module('chronos').controller('TicketListCtrl',['$scope', 'ticketFilterService', 'headingService', function ($scope, ticketFilterService, headingService){
  $scope.itemsPerPage = ticketFilterService.itemsPerPage;
  $scope.tickets = ticketFilterService.tickets;
  headingService.set("Issues List")
  console.log(headingService.pageHeading)

  $scope.pageChange = function(newPageNumber){
    console.log(newPageNumber)
    offset = (newPageNumber - 1) * $scope.itemsPerPage
    ticketFilterService.update_tickets_with_filters(offset);
  }
}])
