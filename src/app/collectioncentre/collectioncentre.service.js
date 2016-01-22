(function() {
  'use strict';

  angular
  .module('dados.collectioncentre.service', [
        'dados.constants',
        'dados.common.services.resource'
      ])
  .service('CollectionCentreService', CollectionCentreService);

  CollectionCentreService.$inject = ['ResourceFactory', 'API'];

  function CollectionCentreService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('collectioncentre'));
  }
})();
