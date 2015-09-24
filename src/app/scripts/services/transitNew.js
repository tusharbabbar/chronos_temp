angular.module('chronos').factory('transitNew', function(){
  var showCuration = function(val){
    var element = document.getElementById('curation-hover')
    var selected = document.getElementsByClassName('selected')
    if (val === 0){
      angular.element(element).css('right', '-55%')
      angular.element(selected).removeClass('selected')
    }
    else if (val === 1) {
      angular.element(element).css('right', '0px')
    }
  }

  var toggleLeftNav = function(){
    // var element = document.getElementById('nav-left')
    if ($('#nav-left').css('left') === '-350px'){
      $('#nav-left').css('left','0px');
    }
    else if ($('#nav-left').css('left') === '0px'){
      $('#nav-left').css('left','-350px');
    }
  }
  var data = {
    toggleLeftNav :toggleLeftNav,
    showCuration : showCuration
  }
  return {
    data : data
  }
})
