/**
  Service to set meta info required by the entire Chronos app.
  Each meta parameter has its own function which can be used any where in the angular module.
  To refresh all the meta parameters make a call to 'refresh' method.
*/

angular.module('chronos').factory('Meta',
function($rootScope, SourcesListApi, ProductsListApi, TypesListApi, TeamsListApi){
  var meta = new Object();
  $rootScope.data = $rootScope.data ? $rootScope.data : {};

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
      $scope.assignedTeams = data.teams;
    });
  }

  meta.refresh = function(){
    var metaParams = ['Sources', 'Products', 'Types', 'OwnerTeams', 'AssignedTeams'];
     metaParams.forEach(function(metaParam){
        meta['refresh'+metaParam]();
     })
  }

  return meta;
});
