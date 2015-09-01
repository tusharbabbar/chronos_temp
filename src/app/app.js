
angular.module('chronos', [
  'ngRoute'
]);

angular.module('chronos')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'templates/ticketList.html',
  });
}])
