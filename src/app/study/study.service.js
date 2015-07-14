(function() {
	'use strict';

	angular
		.module('dados.study.service', ['ngResource', 'dados.study.constants'])
		.service('StudyService', StudyService);

	StudyService.$inject = ['$resource', 'STUDY_API'];

	function StudyService($resource, STUDY_API) {
		return $resource(STUDY_API.url, {}, {
			'update': {
				method: 'PUT'
			}
		});
	}
})();