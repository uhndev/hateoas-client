(function() {
  'use strict';
  angular
    .module('dados.common.services.resource', [
      'ngResource'
    ])
    .factory('ResourceFactory', ResourceFactory);

  ResourceFactory.$inject = ['$resource'];

  function ResourceFactory($resource) {
    return {
      create: function (route) {
        return $resource(
          route,
          {id : '@id'},
          {
            'get' : {method: 'GET', isArray: false, transformResponse: _.transformHateoas },
            'query' : {method: 'GET', isArray: true, transformResponse: _.transformHateoas },
            'update' : {method: 'PUT', isArray: false, transformResponse: _.transformHateoas },
            'save' : {method: 'POST', isArray: false, transformResponse: _.transformHateoas }
          }
        );
      }
    };
  }

})();
