angular.module('chronos').controller('LoginCtrl',[ '$scope', '$location', 'LoginApi', 'Util', 'headingService', function($scope, $location, LoginApi, Util, headingService){
  $scope.email = ''
  $scope.password = ''
  headingService.pageHeading.value = "Login to Galaxy"

  $scope.signin = function(){
    console.log('here')
    if ($scope.email && $scope.password) {
      data = {
        email: $scope.email,
        password: $scope.password
      }
      LoginApi.save(data, function(data){
        console.log(data)
        Util.setLoggedInUserId(data.id);
        Util.set_accesstoken(data.access_token);
        $location.path('/')
      });
    }
  }
}])
