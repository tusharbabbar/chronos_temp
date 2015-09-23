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
  SourcesListApi.get({},function(data){
    $scope.sources = data.sources
  })
  ProductsListApi.get({}, function(data){
    $scope.products = data.products
  })
  TeamsListApi.get({all:1, with_members : 1, limit: 100}, function(data){
    console.log(data.teams)
    $scope.teams = data.teams
  })
  TypesListApi.get({}, function(data){
    $scope.types = data.types
  })
  $scope.counts = {}
  TicketsListCountApi.get({my_issues:1},function(data){
    $scope.counts["my_issues"] = data.count
  });
  TicketsListCountApi.get({all_issues:1},function(data){
    $scope.counts["all_issues"] = data.count
  });
  TicketsListCountApi.get({my_team_issues:1},function(data){
    $scope.counts["my_team_issues"] = data.count
  });
  console.log($scope.counts)
  $scope.statuses = [
    {name : 'ORPHAN', icon : '<img src="/assets/fonts/Orphan.svg"></img>'},
    {name : 'CURATION', icon : '<img src="/assets/fonts/Curation.svg"></img>'},
    {name : 'RESOLVED', icon : '<img src="/assets/fonts/Resolved.svg"></img>'},
    {name : 'INPORGRESS', icon : '<img src="/assets/fonts/inProgress.svg"></img>'},
    {name : 'INVALID', icon : '<img src="/assets/fonts/Invalid.svg"></img>'}]

  $scope.selected = ticketFilterService.filters
  console.log($scope.selected === ticketFilterService.filters)
  // var items1 = ['product', 'type', 'source', 'owner', 'team', 'status']
  // for (var i=0;i<items1.length; i++){
  //   $scope[items1[i]] = {}
  // }
  $scope.preFilteredIssues = function(_type){
    console.log('in')
    $scope.selected.my_issues = 0,
    $scope.selected.my_team_issues = 0,
    $scope.selected.all_issues = 0,
    $scope.selected.products = [],
    $scope.selected.teams = [],
    $scope.selected.types = [],
    $scope.selected.sources = [],
    $scope.selected.teams = [],
    $scope.selected.statuses = []
    if (_type == 'my_issues')
      $scope.selected.my_issues = 1
    else if (_type == 'my_team_issues')
      $scope.selected.my_team_issues = 1
    else if (_type == 'all_issues')
      $scope.selected.all_issues = 1
    console.log($scope.selected === ticketFilterService.filters)
    console.log($scope.selected)
    console.log(ticketFilterService.filters)
    $scope.apply_filters()
  }

  $scope.apply_filters = function(){
    ticketFilterService.update_tickets_with_filters(0)
  }

  $scope.preFilteredIssues("all_issues");
  $scope.temp = function(){
    console.log($scope)
  }
}])
