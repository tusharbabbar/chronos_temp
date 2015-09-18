angular.module('chronos').controller('LoginCtrl',[ '$scope', '$location', 'LoginApi', 'Util', 'headingService', function($scope, $location, LoginApi, Util, headingService){
  $scope.email = '';
  $scope.password = '';
  headingService.pageHeading.value = "Login to Galaxy";
  $("#nav-top").hide();
  $("#nav-top-left").hide();
  $("body").css("background-color", "#095675");
  $scope.signin = function(){
    console.log('here');
    if ($scope.email && $scope.password) {
      data = {
        email: $scope.email,
        password: $scope.password
      };
      LoginApi.save(data, function(data){
        console.log(data);
        Util.setLoggedInUserId(data.id);
        Util.set_accesstoken(data.access_token);
        $("#nav-top").show();
        $("#nav-top-left").show();
        $("body").css("background-color", "#F7F7F7");
        $location.path('/');
      });
    }
  };
}]);
