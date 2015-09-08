angular.module('chronos').factory('ticketFilterService',function(TicketsListApi){
  'use strict';
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
    statuses : []
  }

  var self = this;

  var get_tickets = function(){
    console.log(tickets);
    return tickets;
  }
  var update_tickets_with_filters = function(offset){
    var self = this;
    var data = {
      offset : offset,
    };
    data.limit = self.itemsPerPage;
    data.my_issues = self.filters.my_issues;
    data.my_team_issues = self.filters.my_team_issues;
    data.all_issues = self.filters.all_issues;
    data.product_id = self.filters.products.map(function(obj){
      return obj.id
    });
    data.type_id = self.filters.types.map(function(obj){
      return obj.id
    });
    data.source_id = self.filters.sources.map(function(obj){
      return obj.id
    });
    data.team_id = self.filters.teams.map(function(obj){
      return obj.id
    });
    data.status = self.filters.statuses.map(function(obj){
      return obj.name
    });
    console.log(data)
    TicketsListApi.get(data, function(data){
       self.tickets.list = data.tickets
       self.tickets.total = data.total
       self.tickets.pages = _.range(window.Math.ceil(data.total/self.itemsPerPage))
       console.log(data.tickets)
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
