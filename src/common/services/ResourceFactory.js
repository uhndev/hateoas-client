/**
 * ResourceFactory
 *
 * Base resource factory used to create and return angular resource objects based on a hateoas response.
 *
 * Usage: (in a service definition, where Model represents a hateoas item)
     Model.$inject = ['ResourceFactory', 'MODEL_API'];

     function ModelService(ResourceFactory, MODEL_API) {
        return ResourceFactory.create(MODEL_API.url);
     }

 * @description Factory to return angular resource objects
 */

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
            'update' : {method: 'PUT', isArray: false },
            'save' : {method: 'POST', isArray: false, transformResponse: _.transformHateoas }
          }
        );
      }
    };
  }

})();
