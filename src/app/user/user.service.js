(function() {
	'use strict';

	angular.module('dados.user.service', ['ngResource'])
	.service('UserService', UserService);

	UserService.$inject = ['$resource', 'API'];

	function UserService($resource, API) {
		return $resource(API.url() + '/user/:id', {}, {
			'update': {
				method: 'PUT'
			}
		});
	}
})();