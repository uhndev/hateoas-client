(function() {
  'use strict';
  angular
    .module('dados.common.directives.pluginEditor.formService', [
      'ngResource', 'dados.form.constants'])
    .factory('FormService', FormService);

  FormService.$inject = ['$resource', 'FORM_API'];

  function FormService($resource, FORM_API) {
    return $resource(
      FORM_API.url,
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
