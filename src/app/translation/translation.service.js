(function() {
  'use strict';
  angular
    .module('dados.translation.service', [
      'dados.constants',
      'dados.common.services.resource'
    ])
    .service('TranslationService', TranslationService);

  TranslationService.$inject = ['ResourceFactory', 'API'];

  function TranslationService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('translation'));
  }

})();
