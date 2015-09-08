angular.module('chronos').factory('headingService',function(){
  var pageHeading = {value : ''}
  var set = function(name){
    this.pageHeading.value = name
  }
  return {
    pageHeading : pageHeading,
    set : set
  }
})
