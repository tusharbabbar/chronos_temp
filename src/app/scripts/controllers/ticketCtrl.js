angular.module('chronos').controller('TicketCtrl',
  [ '$scope',
  '$sce',
  '$routeParams',
  'TicketApi',
  'headingService',
  'ticketFilterService',
  'taOptions',
  function($scope,
    $sce,
    $routeParams,
    TicketApi,
    headingService,
    ticketFilterService,
    taOpeions){
  headingService.pageHeading.value = 'Issue Details'
  var pages = ['all_issues', 'my_issues', 'my_team_issues'];
  console.log(ticketFilterService.filters)
  for(var i=0; i<pages.length; i++){
    console.log(ticketFilterService.filters[pages[i]])
    if (ticketFilterService.filters[pages[i]] == 1)
      $scope.previousPage = pages[i].replace('_', " ")
  }

  TicketApi.get({id:$routeParams.id}, function(data){
    $scope.ticket = data
    date = new Date(data.created_on * 1000)
    $scope.created_on = date.toString()
  });

  $scope.comment="comment"
  // taOptions.toolbar = [
  //     ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
  //     ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
  //     ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
  //     ['html', 'insertImage','insertLink', 'insertVideo', 'wordcount', 'charcount']
  // ];

  $scope.temp = $sce.trustAsHtml('<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li style="color: blue;">Super Easy <b>Theming</b> Options</li><li>Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li>Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE8+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p>')
}]);
