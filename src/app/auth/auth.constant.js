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
          if (_.isEmpty($location.path()) || $state.is('login')) {
            // url is empty, so just use default settings
            switch (level) {
              case 1: $location.url('/client'); $state.go('hateoas'); break;
              case 2: $location.url('/client'); $state.go('hateoas'); break;
              case 3: $state.go('subjectportal.surveys'); break;
              default: $location.url('/client'); $state.go('hateoas'); break;
            }
          } else {
            // otherwise, try matching currentUrl to state urls to find the correct state
            var isCustomState = false;
            angular.forEach($state.get(), function (state) {
              var currentUrl = $location.path();
              if (state.name && state.url && currentUrl == state.url ||
                (_.has(state, 'data') && currentUrl == state.data.fullUrl)) {
                $state.go(state.name);
                isCustomState = true;
              }
            });

            // no matches, default to hateoas state
            if (!isCustomState) {
              $state.go('hateoas');
            }
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
