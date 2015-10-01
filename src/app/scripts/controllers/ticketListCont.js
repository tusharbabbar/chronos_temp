angular.module('chronos').controller('TicketListCtrl',
	['$scope',
  '$location',
	'$window',
	'ticketFilterService',
	'headingService',
	'ticketCurationService',
	'transitNew',
	'$routeParams',
	function (
		$scope,
    $location,
		$window,
		ticketFilterService,
		headingService,
		ticketCurationService,
		transitNew,
		$routeParams){
  $scope.itemsPerPage = ticketFilterService.itemsPerPage;
  $scope.tickets = ticketFilterService.tickets;
  headingService.set("Issues List");

  $scope.openTicket = function(id) {
		$scope.selected = id
    for(i in $scope.tickets.list){
      currentTicket = $scope.tickets.list[i];
      if(currentTicket.id == id){
        if(currentTicket.status == 'ORPHAN' || currentTicket.status == 'CURATION'){
          ticketCurationService.setTicketId(id);
					transitNew.data.showCuration(1);
          angular.element(document.getElementById('curation-main')).scope().showTicket();
        }
        else{
					transitNew.data.showCuration(0)
          $location.path("/ticket/" + id);
        }
      }
    }
  };

  $scope.pageChange = function(newPageNumber){
    offset = (newPageNumber - 1) * $scope.itemsPerPage;
		ticketFilterService.filters['offset'] = offset;
    ticketFilterService.update_tickets_with_filters();
  }
}]);
