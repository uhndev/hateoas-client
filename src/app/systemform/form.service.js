(function() {
  'use strict';
  angular
    .module('dados.form.service', [
      'ngResource',
      'dados.form.constants'
    ])
    .service('SystemFormService', SystemFormService);

  SystemFormService.$inject = ['$resource', 'SYSTEMFORM_API'];

  function SystemFormService($resource, SYSTEMFORM_API) {
    return $resource(
      SYSTEMFORM_API.url,
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
