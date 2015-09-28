angular.module('chronos').controller('TicketListFilterCtrl',
                          ['$scope',
                            'ticketFilterService',
                            'ProductsListApi',
                            'SourcesListApi',
                            'TeamsListApi',
                            'TypesListApi',
                            'TicketsListCountApi',
                            function ($scope,
                              ticketFilterService,
                               ProductsListApi,
                               SourcesListApi,
                               TeamsListApi,
                               TypesListApi,
                               TicketsListCountApi
                            ){
  $scope.data = $scope.data ? $scope.data : {};
  $scope.data.statuses = [
    {name : 'ORPHAN', icon : '<img src="/assets/fonts/Orphan.svg"></img>'},
    {name : 'CURATION', icon : '<img src="/assets/fonts/Curation.svg"></img>'},
    {name : 'RESOLVED', icon : '<img src="/assets/fonts/Resolved.svg"></img>'},
    {name : 'INPORGRESS', icon : '<img src="/assets/fonts/inProgress.svg"></img>'},
    {name : 'INVALID', icon : '<img src="/assets/fonts/Invalid.svg"></img>'}]

  $scope.selected = ticketFilterService.filters;
  $scope.preFilteredIssues = function(_type){
    $scope.selected.my_issues = 0
    $scope.selected.my_team_issues = 0
    $scope.selected.all_issues = 0
    $scope.selected.products = []
    $scope.selected.teams = []
    $scope.selected.types = []
    $scope.selected.sources = []
    $scope.selected.teams = []
    $scope.selected.statuses = []
    $scope.selected.offset = 0
    if (_type == 'my_issues')
      $scope.selected.my_issues = 1
    else if (_type == 'my_team_issues')
      $scope.selected.my_team_issues = 1
    else if (_type == 'all_issues')
      $scope.selected.all_issues = 1
    $scope.apply_filters()
  }

  $scope.apply_filters = function(){
    ticketFilterService.update_tickets_with_filters(0)
  }

  $scope.preFilteredIssues("all_issues");
}])
