angular.module('chronos').controller('TicketListCtrl',
	['$scope',
  '$location',
	'$window',
	'ticketFilterService',
	'headingService',
	'ticketCurationService',
	function (
		$scope,
    $location,
		$window,
		ticketFilterService,
		headingService,
		ticketCurationService){
  $scope.itemsPerPage = ticketFilterService.itemsPerPage;
  $scope.tickets = ticketFilterService.tickets;
  headingService.set("Issues List");

  console.log(headingService.pageHeading)

  $scope.openTicket = function(id) {
    for(i in $scope.tickets.list){
      currentTicket = $scope.tickets.list[i];
      if(currentTicket.id == id){
        loginUser = $window.localStorage.UserId;
        currentUser = -1;
        if(currentTicket.assignment_details){
          currentUser = currentTicket.assignment_details.member.user.id;
        }
        if( loginUser == currentUser && currentTicket.status == 'CURATION'){
          $window.showCuration(0);
          $location.path("/ticket/" + id);
        }
        else if(currentTicket.status == 'ORPHAN' || currentTicket.status == 'CURATION'){
          ticketCurationService.setTicketId(id);
          $window.showCuration(1);
          angular.element(document.getElementById('curation-main')).scope().showTicket();
        }
        else{
          $window.showCuration(0);
          $location.path("/ticket/" + id);
        }
      }
    }
  };

  $scope.pageChange = function(newPageNumber){
    console.log(newPageNumber)
    offset = (newPageNumber - 1) * $scope.itemsPerPage;
		ticketFilterService.filters['offset'] = offset;
    ticketFilterService.update_tickets_with_filters();
  }
}]);
