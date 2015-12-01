(function() {
	'use strict';
	angular
		.module('dados.auth.constants', ['dados.constants'])
    .service('DefaultRouteService', DefaultRouteService)
		.service('AUTH_API', Auth);

    DefaultRouteService.$inject = ['$location', '$state'];
    Auth.$inject = ['API'];

    /**
     * DefaultRouteService
     * @description Returns a function that upon successful login, route accordingly to a user's access level
     * @param $location
     * @param $state
     * @returns {Function}
     * @constructor
     */
    function DefaultRouteService($location, $state) {
      return {
        route: function(level) {
          switch (level) {
            case 1: $location.url('/study'); $state.go('hateoas'); break;
            case 2: $location.url('/study'); $state.go('hateoas'); break;
            case 3: $state.go('subjectportal.surveys'); break;
            default: $location.url('/study'); $state.go('hateoas'); break;
          }
        }
      };
    }

		function Auth(API) {
			return {
				'LOGIN_API': API.base() + '/auth/local',
				'LOGOUT_API': API.base() + '/logout'
			};
		}
})();
