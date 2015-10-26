(function() {
	'use strict';
	angular
		.module('dados.access.constants', ['dados.constants'])
    .service('ROLE_API', Role)
		.service('GROUP_API', Group)
		.service('MODEL_API', Model);

    Role.$inject = ['API'];
		Group.$inject = ['API'];
		Model.$inject = ['API'];

    function Role(API) {
      return { url: API.url() + '/role/:id' };
    }

		function Group(API) {
			return { url: API.url() + '/group/:id' };
		}

		function Model(API) {
			return { url: API.url() + '/model/:id' };
		}
})();
