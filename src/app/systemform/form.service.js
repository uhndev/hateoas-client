(function() {
  'use strict';
  angular
    .module('dados.form.service', [
      'dados.form.constants',
      'dados.common.services.resource'
    ])
    .service('SystemFormService', SystemFormService);

  SystemFormService.$inject = ['ResourceFactory', 'SYSTEMFORM_API'];

  function SystemFormService(ResourceFactory, SYSTEMFORM_API) {
    return ResourceFactory.create(SYSTEMFORM_API.url);
  }

})();
