(function() {
	'use strict';

	angular
		.module('dados.access.service', ['ngResource', 'dados.access.constants'])
		.service('GroupService', GroupService)
		.service('ModelService', ModelService);

	GroupService.$inject = ['$resource', 'GROUP_API'];
	ModelService.$inject = ['$resource', 'MODEL_API'];

	function GroupService($resource, GROUP_API) {
		return $resource(GROUP_API.url, {}, {
			'update': {
				method: 'PUT'
			}
		});
	}

	function ModelService($resource, MODEL_API) {
		return $resource(MODEL_API.url, {}, {
			'update': {
				method: 'PUT'
			}
		});
	}	
})();