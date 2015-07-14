(function() {
  'use strict';
  angular
    .module('dados.common.directives.pluginEditor.formService', ['ngResource'])
    .factory('FormService', FormService);
    
  FormService.$inject = ['$resource'];

  function FormService($resource) {
    return $resource(
      'http://localhost:1337/api/userform/:id', 
      {id : '@id'},
      {
        'get' : {method: 'GET', isArray: false, transformResponse: transformHateoas },
        'query' : {method: 'GET', isArray: true, transformResponse: transformHateoas },
        'update' : {method: 'PUT', isArray: false, transformResponse: transformHateoas },
        'save' : {method: 'POST', isArray: false, transformResponse: transformHateoas }
      }
    );
  }
  
  function transformHateoas(data, headersGetter) {
    var jsonData = angular.fromJson(data);
    if (jsonData.hasOwnProperty('items')) {
      return jsonData.items;
    }
    return jsonData;
  }
  
})();
