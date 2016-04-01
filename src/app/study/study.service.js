(function() {
  'use strict';

  angular
  .module('dados.study.service', [
        'dados.constants',
        'dados.common.services.resource'
      ])
  .service('StudyService', StudyService);

  StudyService.$inject = ['ResourceFactory', 'API'];

  function StudyService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('study'));
  }

})();
