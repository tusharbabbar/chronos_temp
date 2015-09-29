angular.module('chronos').factory('transitNew', function($rootScope){
  var leftNavActive = false;
  var showCuration = function(val){
    var element = document.getElementById('curation-hover');
    var selected = document.getElementsByClassName('selected');
    if (val === 0){
      angular.element(element).css('right', '-55%')
      angular.element(selected).removeClass('selected')
    }
    else if (val === 1) {
      angular.element(element).css('right', '0px')
    }
  }

  var toggleLeftNav = function(){
    if ($('#nav-left').css('left') === '-350px'){
      $('#nav-left').css('left','0px');
      leftNavActive = true;
    }
    else if ($('#nav-left').css('left') === '0px'){
      leftNavActive = false;
      $('#nav-left').css('left','-350px');
    }
  }

  var hideTransitions = function(){
    if(leftNavActive) toggleLeftNav();
  }
  $rootScope.hideTransitions = hideTransitions;
  var data = {
    toggleLeftNav :toggleLeftNav,
    showCuration : showCuration,
    hideTransitions : hideTransitions
  }
  return {
    data : data
  }
})
