angular.module('chronos').controller('LoginCtrl',[
  '$scope',
  '$location',
  'LoginApi',
  'Util',
  'headingService',
  'Meta',
  function(
    $scope,
    $location,
    LoginApi,
    Util,
    headingService,
    Meta
  ){
  $scope.email = '';
  $scope.password = '';
  headingService.pageHeading.value = "Login to Galaxy";
  $("#nav-top").hide();
  $("#nav-top-left").hide();
  $("#curation-hover").hide();
  $("#nav-left").hide();
  $("body").css("background-color", "#095675");
  $scope.signin = function(){
    //console.log('here');
    if ($scope.email && $scope.password) {
      data = {
        email: $scope.email,
        password: $scope.password
      };
      LoginApi.save(data, function(data){
        //console.log(data);
        Util.setLoggedInUserId(data.id);
        Util.set_accesstoken(data.access_token);
        $("#nav-top").show();
        $("#nav-top-left").show();
        $("#curation-hover").show();
        $("#nav-left").show();
        $("body").css("background-color", "#F7F7F7");
        Meta.refresh();
        $location.path('/');
      });
    }
  };
}]);
