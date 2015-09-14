angular.module('chronos').controller('TicketListCtrl',
	['$scope',
	'$window',
	'ticketFilterService',
	'headingService',
	'ticketCurationService',
	function (
		$scope,
		$window,
		ticketFilterService,
		headingService,
		ticketCurationService){
  $scope.itemsPerPage = ticketFilterService.itemsPerPage;
  $scope.tickets = ticketFilterService.tickets;
  headingService.set("Issues List");

  console.log(headingService.pageHeading)

  $scope.openTicketCuration = function(id) {
    console.log(id)
    ticketCurationService.setTicketId(id);
    console.log(ticketCurationService)
    console.log(ticketCurationService.getTicketId())
    console.log("ticket Id set in services");
    $window.showCuration(1);
    angular.element(document.getElementById('curation-main')).scope().showTicket();
  };

  $scope.pageChange = function(newPageNumber){
    console.log(newPageNumber)
    offset = (newPageNumber - 1) * $scope.itemsPerPage
    ticketFilterService.update_tickets_with_filters(offset);
  }
}]);
