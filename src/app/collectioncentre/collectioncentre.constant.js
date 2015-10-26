(function() {
	'use strict';
	angular
		.module('dados.collectioncentre.constants', ['dados.constants'])
		.service('COLLECTIONCENTRE_API', CollectionCentre);
		CollectionCentre.$inject = ['API'];
		function CollectionCentre(API) {
			return { url: API.url() + '/collectioncentre/:id' };
		}
})();