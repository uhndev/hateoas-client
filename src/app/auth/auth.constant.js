(function() {
	'use strict';
	angular
		.module('dados.auth.constants', ['dados.constants'])
		.service('AUTH_API', Auth);
		Auth.$inject = ['API'];
		function Auth(API) {
			return {
				'LOGIN_API': API.base() + '/auth/local',
				'LOGOUT_API': API.base() + '/logout'
			};
		}
})();