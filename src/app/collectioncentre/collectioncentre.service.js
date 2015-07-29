(function() {
	'use strict';

	angular
		.module('dados.collectioncentre.service', [
      'dados.collectioncentre.constants',
      'dados.common.services.resource'
    ])
		.service('CollectionCentreService', CollectionCentreService);

	CollectionCentreService.$inject = ['ResourceFactory', 'COLLECTIONCENTRE_API'];

	function CollectionCentreService(ResourceFactory, COLLECTIONCENTRE_API) {
		return ResourceFactory.create(COLLECTIONCENTRE_API.url);
	}
})();
