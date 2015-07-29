(function() {
  'use strict';
  angular
    .module('dados.common.directives.pluginEditor.formService', [
      'dados.form.constants',
      'dados.common.services.resource'
    ])
    .factory('FormService', FormService);

  FormService.$inject = ['ResourceFactory', 'FORM_API'];

  function FormService(ResourceFactory, FORM_API) {
    return ResourceFactory.create(FORM_API.url);
  }

})();
