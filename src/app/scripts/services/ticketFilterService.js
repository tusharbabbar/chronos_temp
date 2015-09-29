angular.module('chronos').factory('ticketFilterService',function($rootScope, TicketsListApi){
  var tickets = {};
  tickets.list = [];
  tickets.total = 0;
  tickets.pages = 0;
  var itemsPerPage = 25;
  var filters = {
    my_issues : 0,
    my_team_issues : 0,
    all_issues : 0,
    products : [],
    teams : [],
    types : [],
    sources : [],
    statuses : [],
    offset: 0,
    itemsPerPage: itemsPerPage
  };

  var self = this;

  var get_tickets = function(){
    //console.log(tickets);
    return tickets;
  }
  var update_tickets_with_filters = function(){
    var self = this;
    var filtersAttr = ['product', 'type', 'source', 'team', 'statuse'];

    var data = {
      offset : self.filters.offset,
      limit : self.filters.itemsPerPage,
      my_issues : self.filters.my_issues,
      my_team_issues : self.filters.my_team_issues,
      all_issues : self.filters.all_issues
    };
    filtersAttr.forEach(function(filterAttr){
      data[filterAttr + "_id"] = self.filters[filterAttr + "s"].map(function(obj){
          return obj.id
      })
    });
    data.status = self.filters.statuses.map(function(obj){
      return obj.name
    });

    TicketsListApi.get(data, function(data){
      now = Date.now()/1000
      var timeRemainingTicketStatus = ["INPROGRESS", "ORPHAN", "CURATION"];
      if(data.tickets)
      data.tickets.forEach(function(ticket){
        if(timeRemainingTicketStatus.indexOf(ticket.status) > -1){
          ticket['remaining'] = parseInt(((now - ticket['created_on'])/60/60 - ticket['sla']))
          if (ticket['remaining'] > 0){
            var status = "passed"
          }
          else {
            var status = "remains"
          }
          ticket['remaining'] = Math.abs(ticket['remaining']);
          ticket['remaining_days'] =  ticket['remaining'] >= 24  ? parseInt(ticket['remaining'] / 24) : undefined;
          ticket['remaining_hours'] = parseInt(ticket['remaining'] % 24);
          ticket['remaining_days_unit'] = ticket['remaining_days'] == 1 ? ' day &' : ticket['remaining_days'] > 1? ' days &' : undefined;
          ticket['remaining_hours_unit'] = (ticket['remaining_hours'] == 1 ? ' hour ' : ticket['remaining_hours'] > 1 ? " hours " :  undefined) + status;
          ticket['remaining_percent'] = parseInt(((now - ticket['created_on'])/60/60 - ticket['sla']) * -1)/ticket['sla']*100
        }
      })
      self.tickets.list = data.tickets
      self.tickets.total = data.total
      self.tickets.pages = _.range(window.Math.ceil(data.total/self.itemsPerPage))
    })
  }


  return {
    tickets : tickets,
    total : 0,
    itemsPerPage: itemsPerPage,
    filters : filters,
    update_tickets_with_filters : update_tickets_with_filters,
    // get_more_tickets: get_more_tickets
  }
})
