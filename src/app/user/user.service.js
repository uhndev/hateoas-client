(function() {
	'use strict';

	angular
		.module('dados.user.service', ['ngResource', 'dados.user.constants'])
		.service('UserService', UserService)
		.service('UserAccess', UserAccess)
		.service('UserRoles', UserRoles)
    .service('UserEnrollment', UserEnrollment);

	UserService.$inject = ['ResourceFactory', 'USER_API'];
	UserAccess.$inject = ['$resource', 'USER_API'];
	UserRoles.$inject = ['$resource', 'USER_API'];
  UserEnrollment.$inject = ['$resource', 'USER_ENROLLMENT_API'];

	function UserService(ResourceFactory, USER_API) {
    return ResourceFactory.create(USER_API.url);
	}

	function UserAccess($resource, USER_API) {
		return $resource(USER_API.url + '/access', {}, {
			'update': { method: 'PUT' }
		});
	}

	function UserRoles($resource, USER_API) {
		return $resource(USER_API.url + '/roles', {}, {
			'update': { method: 'PUT' }
		});
	}

  function UserEnrollment($resource, USER_ENROLLMENT_API) {
    return $resource(USER_ENROLLMENT_API.url, {}, {
      'update': { method: 'PUT' }
    });
  }

})();
