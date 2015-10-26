(function() {
	'use strict';
	angular
		.module('dados.study.constants', ['dados.constants'])
		.service('STUDY_API', Study);
		Study.$inject = ['API'];
		function Study(API) {
			return { url: API.url() + '/study/:id' };
		}
})();