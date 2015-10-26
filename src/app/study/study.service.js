(function() {
	'use strict';

	angular
		.module('dados.study.service', [
      'dados.study.constants',
      'dados.common.services.resource'
    ])
		.service('StudyService', StudyService);

	StudyService.$inject = ['ResourceFactory', 'STUDY_API'];

	function StudyService(ResourceFactory, STUDY_API) {
		return ResourceFactory.create(STUDY_API.url);
	}

})();
