(function() {
	'use strict';

	angular.module('dados.study.service', ['ngResource'])
	.service('StudyService', StudyService);

	StudyService.$inject = ['$resource', 'API'];

	function StudyService($resource, API) {
		return $resource(API.url() + '/study/:id', {}, {
			'update': {
				method: 'PUT'
			}
		});
	}
})();