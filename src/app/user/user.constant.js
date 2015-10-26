(function() {
	'use strict';
	angular
		.module('dados.user.constants', ['dados.constants'])
		.service('USER_API', User)
    .service('USER_ENROLLMENT_API', UserEnrollment);

		User.$inject = ['API'];
    UserEnrollment.$inject = ['API'];

		function User(API) {
			return { url: API.url() + '/user/:id' };
		}

    function UserEnrollment(API) {
      return { url: API.url() + '/userenrollment/:id' };
    }

})();
