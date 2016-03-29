(function () {
  'use strict';
  angular
    .module('dados.auth.constants', ['dados.constants'])
    .service('DefaultRouteService', DefaultRouteService)
    .service('AUTH_API', Auth);

  DefaultRouteService.$inject = ['$location', '$state', 'AuthService'];
  Auth.$inject = ['API'];

  /**
   * DefaultRouteService
   * @description Returns a function that upon successful login, route accordingly to a user's access level
   * @param $location
   * @param $state
   * @param Auth
   * @returns {Object}
   * @constructor
   */
  function DefaultRouteService($location, $state, Auth) {
    var service = {
      navigateHome: navigateHome,
      resolve: resolve,
      route: route
    };

    return service;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * navigateHome
     * @description Convenience method for navigating back to the home state.
     */
    function navigateHome() {
      switch (Auth.currentGroup.level) {
        case 1:
          $location.url('/study');
          $state.go('hateoas');
          break;
        case 2:
          $location.url('/study');
          $state.go('hateoas');
          break;
        case 3:
          $state.go('subjectportal.surveys');
          break;
        default:
          $location.url('/study');
          $state.go('hateoas');
          break;
      }
    }

    /**
         * resolve
         * @description Based on current href, determine correct custom state if applicable, or go to hateoas state
         */
    function resolve() {
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

    /**
     * route
     * @description Routes to default home states/urls
     * @param level Authentication level of current user
     */
    function route(level) {
      if (_.isEmpty($location.path()) || $state.is('login')) {
        // url is empty, so just use default settings
        navigateHomeState();
      } else {
        // otherwise, try matching currentUrl to state urls to find the correct state
        service.resolve();
      }
    }
  }

  function Auth(API) {
    return {
      'LOGIN_API': API.base() + '/auth/local',
      'LOGOUT_API': API.base() + '/logout'
    };
  }
})();
