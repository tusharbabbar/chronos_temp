/**
Service to set meta info required by the entire Chronos app.
Each meta parameter has its own function which can be used any where in the angular module.
To refresh all the meta parameters make a call to 'refresh' method.
*/

angular.module('chronos').factory('Meta',
function($rootScope, SourcesListApi, ProductsListApi, TypesListApi, TeamsListApi, TicketsListCountApi){
  var meta = new Object();
  $rootScope.data = $rootScope.data ? $rootScope.data : {};
  $rootScope.data.counts = {}

  meta.refreshSources = function(){
    SourcesListApi.get(function (data) {
      $rootScope.data.sources = data.sources;
    });
  };

  meta.refreshProducts = function(){
    ProductsListApi.get(function (data) {
      $rootScope.data.products = data.products;
    });
  };

  meta.refreshTypes = function(){
    TypesListApi.get(function (data) {
      $rootScope.data.types = data.types;
    });
  };

  meta.refreshOwnerTeams = function(){
    TeamsListApi.get( {if_owner : 1, with_members : 1}, function (data) {
      $rootScope.data.ownerTeams = data.teams;
    });
  };

  meta.refreshAssignedTeams = function(){
    TeamsListApi.get( {all : 1, with_members : 1}, function (data) {
      $rootScope.data.assignedTeams = data.teams;
    });
  }

  meta.refreshMyIssuesCount = function(){
    TicketsListCountApi.get({my_issues:1},function(data){
      $rootScope.data.counts["my_issues"] = data.count ? data.count  : 0;
    });
  }

  meta.refreshAllIssuesCount = function(){
    TicketsListCountApi.get({all_issues:1},function(data){
      $rootScope.data.counts["all_issues"] = data.count ? data.count : 0;
    });
  }

  meta.refreshMyTeamIssueCount = function(){
    TicketsListCountApi.get({my_team_issues:1},function(data){
      $rootScope.data.counts["my_team_issues"] = data.count ? data.count : 0;
    });
  }

  meta.refreshDashboradCounts = function(){
    $rootScope.data.ticketCount = {};
    TicketsListCountApi.get({my_issues:1, status:["ORPHAN","CURATION"]},function(data){
      $rootScope.data.ticketCount["new"] = data.count ? data.count  : 0;
    });
    TicketsListCountApi.get({my_issues:1, status:"INPROGRESS"},function(data){
      $rootScope.data.ticketCount["inProgress"] = data.count ? data.count  : 0;
    });
  }
  meta.refresh = function(){
    var metaParams = [
      'Sources',
      'Products',
      'Types',
      'OwnerTeams',
      'AssignedTeams',
      'MyIssuesCount',
      'AllIssuesCount',
      'MyTeamIssueCount',
      'DashboradCounts'
    ];
    metaParams.forEach(function(metaParam){
      meta['refresh'+metaParam]();
    })
  }

  return meta;
});
