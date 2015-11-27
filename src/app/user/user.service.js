(function() {
	'use strict';

	angular
		.module('dados.user.service', [
      'dados.constants',
      'dados.common.services.resource'
    ])
		.service('UserService', UserService)
		.service('UserRoles', UserRoles)
    .service('UserEnrollment', UserEnrollment);

  [UserService, UserRoles, UserEnrollment].map(function (service) {
    service.$inject = ['ResourceFactory', 'API'];
  });

	function UserService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('user'));
	}

	function UserRoles(ResourceFactory, API) {
    return ResourceFactory.create(API.url('user') + '/roles');
	}

  function UserEnrollment(ResourceFactory, API) {
    return ResourceFactory.create(API.url('userenrollment'));
  }

})();
