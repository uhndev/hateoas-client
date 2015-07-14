(function() {
  'use strict';
  angular
    .module('dados.common.directives.pluginEditor.formService', ['ngResource'])
    .factory('FormService', FormService);
    
  FormService.$inject = ['$resource'];

  function FormService($resource) {
  /*
    return $resource('http://localhost:1337/api/userform/:id',
        {id : '@id'},
        {
          query : {method: 'GET', isArray: false },
          update : {method : 'PUT'}
        }
    );
  */
    return $resource(
      'http://localhost:1337/api/userform/:id', 
      {id : '@id'},
      {'query' : {method: 'GET', isArray: true, transformResponse: transformHateoas }}
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
