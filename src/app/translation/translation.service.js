(function() {
  'use strict';
  angular
    .module('dados.translation.service', [
      'dados.translation.constants',
      'dados.common.services.resource'
    ])
    .service('TranslationService', TranslationService);

  TranslationService.$inject = ['ResourceFactory', 'TRANSLATION_API'];

  function TranslationService(ResourceFactory, TRANSLATION_API) {
    return ResourceFactory.create(TRANSLATION_API.url);
  }

})();
