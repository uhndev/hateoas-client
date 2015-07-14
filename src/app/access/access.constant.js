(function() {
	'use strict';
	angular
		.module('dados.access.constants', ['dados.constants'])
		.service('GROUP_API', Group)
		.service('MODEL_API', Model);

		Group.$inject = ['API'];
		Model.$inject = ['API'];

		function Group(API) {
			return { url: API.url() + '/group/:id' };
		}

		function Model(API) {
			return { url: API.url() + '/model/:id' };
		}
})();