'use strict';
/**
 * @ngdoc service
 * @name Chronos.Util
 * @description
 * # Util
 * Service in the Chronos.
 */
angular.module('chronos').factory('Util', [
  '$window',
  function ($window) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var set_accesstoken = function (token) {
      $window.localStorage['X-Token'] = token;
    };
    var get_accesstoken = function () {
      return $window.localStorage['X-Token'];
    };
    var setLoggedInUserId = function (user_id) {
      $window.localStorage.UserId = user_id;
    };
    var getLoggedInUserId = function () {
      user_id = $window.localStorage.UserId;
      return user;
    };
    var logoutUser = function () {
      $window.localStorage.clear();
    };
    return {
      set_accesstoken: set_accesstoken,
      get_accesstoken: get_accesstoken,
      setLoggedInUserId: setLoggedInUserId,
      getLoggedInUserId: getLoggedInUserId,
      logoutUser: logoutUser
    };
  }
])
