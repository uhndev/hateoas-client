(function() {
  'use strict';
  angular
    .module('dados.form.service', [
      'dados.constants',
      'dados.common.services.resource'
    ])
    .service('SystemFormService', SystemFormService);

  SystemFormService.$inject = ['ResourceFactory', 'API'];

  function SystemFormService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('systemform'));
  }

})();
