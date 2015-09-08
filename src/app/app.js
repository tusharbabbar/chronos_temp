'use strict';

angular.module('chronos', [
  'ngRoute',
  'ngResource',
  'ui.select',
  'angularUtils.directives.dirPagination',
  'ngSanitize',
  'isteven-multi-select'
]);

angular.module('chronos')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'templates/ticketList.html',
    controller: 'TicketListCtrl'
  }).when('/login', {
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  });
}]).factory('authHttpResponseInterceptor', [
  '$q',
  '$location',
  'Util',
  function ($q, $location, Util) {
    return {
      request: function (request) {
        request.headers['X-Token'] = Util.get_accesstoken();
        return request;
      },
      response: function (response) {
        if (response.status === 401) {
          console.log('Response 401');
        }
        return response || $q.when(response);
      },
      responseError: function (rejection) {
        if (rejection.status === 401) {
          console.log('Response Error 401', rejection);
          $('#nav-top').css('display', 'none')
          $('#nav-top-left').css('left', 'none')
          $location.path('/login').search('returnTo', $location.path());
        } else {
          console.log('Api Error');
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
  }])
