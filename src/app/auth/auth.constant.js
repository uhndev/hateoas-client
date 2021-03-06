(function () {
  'use strict';
  angular
    .module('dados.auth.constants', ['dados.constants'])
    .service('DefaultRouteService', DefaultRouteService)
    .service('AUTH_API', Auth);

  DefaultRouteService.$inject = ['$location', '$state', '$urlMatcherFactory', 'AuthService'];
  Auth.$inject = ['API'];

  /**
   * DefaultRouteService
   * @description Returns a function that upon successful login, route accordingly to a user's access level
   * @param $location
   * @param $state
   * @param $urlMatcherFactory
   * @param Auth
   * @returns {Object}
   * @constructor
   */
  function DefaultRouteService($location, $state, $urlMatcherFactory, Auth) {
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
          $location.url('/client');
          $state.go('hateoas');
          break;
        case 2:
          $location.url('/client');
          $state.go('hateoas');
          break;
        case 3:
          $state.go('subjectportal.surveys');
          break;
        default:
          $location.url('/client');
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
        var fullUrl = null;
        var matchesUrl = false;
        if (_.has(state, 'data') && _.has(state.data, 'fullUrl')) {
          fullUrl = state.data.fullUrl;
          matchesUrl = (currentUrl === fullUrl || new RegExp(fullUrl).test(currentUrl));
        }

        if (state.name && state.url && currentUrl === state.url || matchesUrl) {
          var urlMatcher = $urlMatcherFactory.compile(state.url);
          var matchedParams = urlMatcher.exec(currentUrl);
          if (matchedParams) {
            $state.go(state.name, matchedParams);
          } else {
            $state.go(state.name);
          }

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
        navigateHome();
      } else {
        // otherwise, try matching currentUrl to state urls to find the correct state
        service.resolve();
      }
    }
  }

  /**
   * AuthService
   * @description Returns authentication route strings
   * @returns {Object}
   * @constructor
   */
  function Auth(API) {
    return {
      'LOGIN_API': API.base() + '/auth/local',
      'LOGOUT_API': API.base() + '/logout'
    };
  }
})();
