angular.module('chronos').factory('ticketCurationService',function(){
  var ticketId;
  var showFlag = false;
  var setTicketId = function(id){
  	//console.log('in',id)
    this.ticketId = id;
    this.showFlag = true;
  };
  var getTicketId = function() {
  	return this.ticketId;
  };

  var resetTicketCuration = function(){
  	this.showFlag = false;
  }
  return {
    getTicketId : getTicketId,
    setTicketId : setTicketId,
    resetTicketCuration : resetTicketCuration
  }
});