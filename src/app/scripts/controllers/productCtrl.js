'use strict';

angular.module('chronos').controller('ProductCtrl', function ($scope, ProductApi, ProductsListApi) {
  $scope.Heading = 'Products';
  var products = ProductsListApi.get();
  products.$promise.then(function (data) {
    $scope.products = data.products;
  });
  $scope.changeStatus = function (_product) {
    ProductApi.update({ id: _product.id }, { 'active': !_product.active }, function (data) {
      _product.active = !_product.active;
    }, function (data) {
      console.log(data);
      window.alert('cannot complete request');
    });
  };
  $scope.addProduct = function (name) {
    ProductsListApi.save({ 'name': name }, function (data) {
      $scope.products.push(data.product);
      $scope.name = null;
    }, function (data) {
      console.log(data);
    });
  };
  $scope.submit = function(event) {
    if(event.charCode == 13){
        if($scope.name){
            $scope.addProduct($scope.name);
        }
    }
  };
});
