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
      /**
       * create
       * @description Factory function that creates configurable, templated angular $resources
       * @param route
       * @param options
       * @returns {*}
       */
      create: function (route, options) {
        var resourceConfig = {
          'get' : {method: 'GET', isArray: false},
          'query' : {method: 'GET', isArray: true},
          'update' : {method: 'PUT', isArray: false},
          'save' : {method: 'POST', isArray: false}
        };

        // allow overrides on the default transformResponses
        var methods = _.has(options, 'transformResponse') ? options.transformResponse : ['get', 'query', 'save'];
        _.each(methods, function (method) {
          resourceConfig[method].transformResponse = _.transformHateoas;
          resourceConfig[method].isArray = method === 'query'; // since query is the only method that expects an array
        });

        // allow caching of $resources
        if (_.has(options, 'cache') && options.cache) {
          _.each(['get', 'query'], function (method) {
            resourceConfig[method].cache = true;
          });
        }

        return $resource(route, {id : '@id'}, resourceConfig);
      }
    };
  }

})();
