angular.module('chronos').controller('addCtrl',
  [ '$scope',
    'SourcesListApi',
    'ProductsListApi',
    'TypesListApi',
    'headingService',
     function($scope,
      SourcesListApi,
      ProductsListApi,
      TypesListApi,
      headingService
      ){
          headingService.pageHeading.value = 'Configurations'
          //get list of sources
          SourcesListApi.get(function (data) {
            $scope.sources = data.sources;
          });
          //get list of products
          ProductsListApi.get(function (data) {
            $scope.products = data.products;
          });
          //get list of types
          TypesListApi.get(function (data) {
            $scope.types = data.types;
          });

          $scope.addProduct = function(){
            if(!$scope.product){
              alert('Product Field can not be empty');
              return;
            }

            ProductsListApi.save( {name : $scope.product} , function(data){
              $scope.product=""
              $scope.products.push(data.product);
              //console.log("Product added successfully");
            }, function(errorData){
              //console.log(errorData);
            });
          };

          $scope.addSource = function(){
            if(!$scope.source){
              alert('Source Field can not be empty');
              return;
            }

            SourcesListApi.save( {name : $scope.source} , function(data){
              $scope.source="";
              $scope.sources.push(data.source);
              //console.log("Source added successfully");
            }, function(errorData){
              //console.log(errorData);
            });
          };

          $scope.addType = function(){
            if(!$scope.type){
              alert('Type Field can not be empty');
              return;
            }
            if($scope.sla <= 0){
              alert("SLA should be greater than 0");
              return;
            }
            TypesListApi.save( {name : $scope.type, sla : $scope.sla} , function(data){
              $scope.type="";
              $scope.sla="";
              $scope.types.push(data.type);
              //console.log("type added successfully");
            }, function(errorData){
              //console.log(errorData);
            });
          };
}]);
