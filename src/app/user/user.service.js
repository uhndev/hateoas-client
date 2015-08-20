(function() {
	'use strict';

	angular
		.module('dados.user.service', ['ngResource', 'dados.user.constants'])
		.service('UserService', UserService)
		.service('UserRoles', UserRoles)
    .service('UserEnrollment', UserEnrollment);

	UserService.$inject = ['ResourceFactory', 'USER_API'];
	UserRoles.$inject = ['ResourceFactory', 'USER_API'];
  UserEnrollment.$inject = ['ResourceFactory', 'USER_ENROLLMENT_API'];

	function UserService(ResourceFactory, USER_API) {
    return ResourceFactory.create(USER_API.url);
	}

	function UserRoles(ResourceFactory, USER_API) {
    return ResourceFactory.create(USER_API.url + '/roles');
	}

  function UserEnrollment(ResourceFactory, USER_ENROLLMENT_API) {
    return ResourceFactory.create(USER_ENROLLMENT_API.url);
  }

})();
