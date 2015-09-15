/**
 * @ngdoc service
 * @name Chronos.Api
 * @description
 * # Api
 * Service in the Chronos.
 */
//var baseUrl = 'http://stag-chronos-free.practodev.in/api';
var baseUrl = 'http://localhost:5000/api';
angular.module('chronos').factory('LoginApi', [
 '$resource',
  function($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return $resource(baseUrl + '/login', {
        save: {
          isArray: false,
          method: 'POST'
        }
    });
  }
]).factory('TicketApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/tickets/:id', {
      id: '@id'
    }, {
      query: {
        isArray: false,
        method: 'GET'
      },
      update: {
        method: 'PATCH'
      }
    });
  }
]).factory('TicketsListCountApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/tickets/count', {
    }, {
      query: {
        isArray: false,
        method: 'GET'
      },
      update: {
        method: 'PATCH'
      }
    });
  }
]).factory('TicketCommentApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/tickets/:ticket_id/comments/:comment_id', {
      ticket_id: '@ticket_id',
      comment_id: '@comment_id'
    }, {
      query: {
        isArray: false,
        method: 'GET'
      },
      update: {
        method: 'PATCH'
      }
    });
  }
]).factory('TicketTagApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/tickets/:ticket_id/tags', {
      ticket_id: '@ticket_id'
    }, {
      query: {
        isArray: false,
        method: 'GET'
      }
    });
  }
]).factory('TicketsListApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/tickets', {
      query: {
        isArray: false,
        method: 'GET'
      },
      save: {
        method: 'POST'
      }
    });
  }
]).factory('TicketCommentsListApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/tickets/:ticket_id/comments', {
      ticket_id: '@ticket_id'
    }, {
      query: {
        isArray: false,
        method: 'GET'
      },
      save: {
        method: 'POST'
      }
    });
  }
]).factory('AssignmentActionApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/assignmentactions');
  }
]).factory('TypeApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/types/:id', {
      id: '@id'
    }, {
      query: {
        isArray: false,
        method: 'GET'
      },
      update: {
        method: 'PATCH'
      }
    });
  }
]).factory('TicketMailsApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/tickets/:id/mails', {
      id: '@id'
    }, {
      save: {
        method: 'POST'
      }
    });
  }
]).factory('TicketTimelineApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/ticket/:id/timeline', {
      id: '@id'
    }, {
      get: {
        method: 'GET',
        isArray: false
      }
    });
  }
]).factory('MailgunListenerApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/tickets/mailgunlistener', {
      save: {
        method: 'POST'
      }
    });
  }
]).factory('TicketFilesApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/tickets/:ticket_id/files', {
      ticket_id: '@ticket_id'
    }, {
      query: {
        isArray: false,
        method: 'GET'
      },
      save: {
        method: 'POST'
      }
    });
  }
]).factory('TicketSubscribersApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/tickets/:ticket_id/subscribers', {
      ticket_id: '@ticket_id'
    }, {
      save: {
        method: 'POST'
      },
      update: {
        method: 'PUT'
      }
    });
  }
]).factory('ChatsApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/tickets/livechat', {
      save: {
        method: 'POST'
      }
    });
  }
]).factory('CallsApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/tickets/call', {
      save: {
        method: 'POST'
      }
    });
  }
]).factory('ActionReasonsApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/tickets/action-reasons/:type', {
      type: '@type',
    }, {
      query: {
        isArray: false,
        method: 'GET'
      }
    });
  }
]).factory('ProductApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/products/:id', {
      id: '@id'
    }, {
      query: {
        isArray: false,
        method: 'GET'
      },
      update: {
        method: 'PATCH'
      }
    });
  }
]).factory('TeamApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/teams/:id', {
      id: '@id'
    }, {
      query: {
        isArray: false,
        method: 'GET'
      },
      update: {
        method: 'PATCH'
      }
    });
  }
]).factory('TeamLevelApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/teamlevels', {
      update: {
        method: 'PATCH'
      }
    });
  }
]).factory('TeamLevelsApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/teamlevels/:id', {
      id: '@id'
    }, {
      query: {
        isArray: false,
        method: 'GET'
      }
    });
  }
]).factory('TeamMembersListApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/teammembers', {
      query: {
        isArray: false,
        method: 'GET'
      }
    });
  }
]).factory('TeamsListApi',[
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/teams', {
      query: {
        isArray: false,
        method: 'GET'
      },
      save: {
        method: 'POST'
      }
    });
  }
]).factory('LevelMembersListApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/levelmembers', {
      update: {
        method: 'POST'
      }
    });
  }
]).factory('LevelMembersApi',[
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/levelmembers/:member_id', {
      id: '@member_id'
    }, {
      query: {
        isArray:false,
        method: 'GET'
      },
      update: {
        method: 'POST'
      }
    });
  }
]).factory('UserApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/users', {
      query: {
        isArray: false,
        method: 'GET'
      }
    });
  }
]).factory('SourceApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/sources/:id', {
      id: '@id'
    }, {
      query: {
        isArray: false,
        method: 'GET'
      },
      update: {
        method: 'PATCH'
      }
    });
  }
]).factory('SourcesListApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/sources', {
      query: {
        method: 'GET'
      },
      save: {
        method: 'POST'
      }
    });
  }
]).factory('TypesListApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/types', {
      query: {
        isArray: false,
        method: 'GET'
      },
      save: {
        method: 'POST'
      }
    });
  }
]).factory('ProductsListApi',[
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/products', {
      query: {
        isArray: false,
        method: 'GET'
      },
      save: {
        method: 'POST'
      }
    });
  }
]).factory('MemberAttendancesApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/member-attendance', {
      save: {
        method: 'POST'
      }
    });
  }
]).factory('MemberAttendanceListApi', [
  '$resource',
  function($resource) {
    return $resource(baseUrl + '/member-attendance/:user_id', {
      user_id: '@user_id'
    }, {
      query: {
        isArray: true,
        method: 'GET'
      },
      update: {
        method: 'PATCH'
      }
    });
  }
]);
