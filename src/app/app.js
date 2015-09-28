angular.module('chronos', [
  'ngRoute',
  'ngResource',
  'ngSanitize',
  'ngTagsInput',
  'isteven-multi-select',
  'textAngular',
  'mentio',
  'flash',
  'angular-loading-bar'
]);

angular.module('chronos')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '/static/ticketList.html',
    controller: 'TicketListCtrl'
  }).when('/login', {
    templateUrl: '/static/login.html',
    controller: 'LoginCtrl'
  }).when('/ticket/:id', {
    templateUrl: '/static/ticket.html',
    controller: 'TicketCtrl'
  }).when('/configure/meta', {
    templateUrl: '/static/add.html',
    controller: 'addCtrl'
  }).when('/configure/teams', {
    templateUrl: '/static/addTeam.html',
    controller: 'addTeamCtrl'
  });
}]).factory('authHttpResponseInterceptor', [
  '$q',
  '$location',
  'Util',
  'Flash',
  function ($q, $location, Util, Flash) {
    return {
      request: function (request) {
        request.headers['X-Token'] = Util.get_accesstoken();
        return request;
      },
      response: function (response) {
        if (response.status === 401) {
          //console.log('Response 401');
        }
        return response || $q.when(response);
      },
      responseError: function (rejection) {
        if (rejection.status === 401) {
          //console.log('Response Error 401', rejection);
          $('#nav-top').css('display', 'none');
          $('#nav-top-left').css('left', 'none');
          $location.path('/login').search('returnTo', $location.path());
        } else {
          //console.log('Api Error');
          Flash.create('danger', rejection.data.message);
        }
        return $q.reject(rejection);
      }
    };
  }
]).config([
  '$httpProvider',
  function ($httpProvider) {
    //Http Intercpetor to check auth failures for xhr requests
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
  }]).run(
    function(Meta){
      Meta.refresh();
    }
  );
