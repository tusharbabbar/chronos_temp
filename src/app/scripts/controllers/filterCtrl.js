angular.module('chronos').controller('TicketListFilterCtrl',['$scope', 'ProductsListApi', function ($scope, ProductsListApi){
  ProductsListApi.get(function(data){
    $scope.products = data.products
  })
  $scope.statuses = ['UNRESOLVED', 'CURATION', 'RESOLVED', 'INPORGRESS']

  var items1 = ['product', 'type', 'source', 'owner', 'team', 'status']
  for (var i=0;i<items1.length; i++){
    $scope[items1[i]] = {}
  }
  $scope.show = function(){
    console.log($scope.products);
  }
}])
