(function() {
	'use strict';

	angular
		.module('dados.collectioncentre.service', ['ngResource', 'dados.collectioncentre.constants'])
		.service('CollectionCentreService', CollectionCentreService);

	CollectionCentreService.$inject = ['$resource', 'COLLECTIONCENTRE_API'];

	function CollectionCentreService($resource, COLLECTIONCENTRE_API) {
		return $resource(COLLECTIONCENTRE_API.url, {}, {
			'update': {
				method: 'PUT'
			}
		});
	}
})();