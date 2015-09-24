angular.module('chronos').factory('ticketFilterService',function(TicketsListApi){
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
    offset: 0
  }

  var self = this;

  var get_tickets = function(){
    console.log(tickets);
    return tickets;
  }
  var update_tickets_with_filters = function(){
    var self = this;
    var data = {
      offset : self.filters.offset,
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
      now = Date.now()/1000
      for (i in data.tickets){
        data.tickets[i]['remaining'] = parseInt(((now - data.tickets[i]['created_on'])/60/60 - data.tickets[i]['sla']))
        if (data.tickets[i]['remaining'] > 0){
          var status = "passed"
        }
        else {
          var status = "remains"
        }
        data.tickets[i]['remaining'] = Math.abs(data.tickets[i]['remaining'])
        if (data.tickets[i]['remaining'] >= 24 ){
          data.tickets[i]['remaining'] = parseInt(data.tickets[i]['remaining'] / 24)
          if (data.tickets[i]['remaining'] == 1){
            data.tickets[i]['remaining_unit'] = 'day ' + status
          }
          else
            data.tickets[i]['remaining_unit'] = 'days ' + status
        }
        else {
          if (data.tickets[i]['remaining'] == 1){
            data.tickets[i]['remaining_unit'] = 'hr ' + status
          }
          else
            data.tickets[i]['remaining_unit'] = 'hrs ' + status
        }
        data.tickets[i]['remaining_percent'] = parseInt(((now - data.tickets[i]['created_on'])/60/60 - data.tickets[i]['sla']) * -1)/data.tickets[i]['sla']*100
      }
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
