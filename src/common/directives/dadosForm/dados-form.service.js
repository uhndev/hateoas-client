(function() {
  'use strict';

  angular
  .module('dados.common.directives.dadosForm.service', [
        'dados.constants',
        'dados.common.services.resource'
      ])
  .service('AnswerSetService', AnswerSetService);

  AnswerSetService.$inject = ['$resource', 'API'];

  function AnswerSetService($resource, API) {
    return $resource(
      API.url() + '/answerset/:id',
      {
        id: '@id'
      },
      {
        'save' : {
          method: 'POST',
          isArray: false,
          transformResponse: _.transformHateoas
        },
        'delete' : {
          method: 'DELETE',
          isArray: false,
          transformResponse: _.transformHateoas
        }
      }
    );
  }

})();
