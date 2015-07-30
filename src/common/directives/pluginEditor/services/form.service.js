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
        'get' : {method: 'GET', isArray: false, transformResponse: _.transformHateoas },
        'query' : {method: 'GET', isArray: true, transformResponse: _.transformHateoas },
        'update' : {method: 'PUT', isArray: false, transformResponse: _.transformHateoas },
        'save' : {method: 'POST', isArray: false, transformResponse: _.transformHateoas }
      }
    );
  }

})();
