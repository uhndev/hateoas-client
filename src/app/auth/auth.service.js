/**
 * Data service for handling all Authentication data
 */
(function() {
  'use strict';

  angular
    .module('dados.auth.service', [
      'ngCookies',
      'ngResource',
      'dados.auth.constants',
      'dados.header.constants'
    ])
    .constant({
      'ADMIN_PAGES': ['/systemformbuilder', '/formbuilder', '/access', '/translation', '/workflow']
    })
    .service('AuthService', AuthService);

  AuthService.$inject = [
    'AUTH_API', 'ADMIN_PAGES', '$rootScope', '$location', '$resource', '$cookies', 'TABVIEW', 'SUBVIEW'
  ];

  function AuthService(Auth, ADMIN_PAGES, $rootScope, $location, $resource, $cookies, TABVIEW, SUBVIEW) {

    var LoginAuth = $resource(Auth.LOGIN_API);
    var currentUser = {};
    var tabview = {};
    var subview = {};

    var service = {
      // variables
      currentUser: currentUser,
      tabview: tabview,
      subview: subview,
      // methods
      isAdmin: isAdmin,
      isCoordinator: isCoordinator,
      isSubject: isSubject,
      isAdminPage: isAdminPage,
      isAuthenticated: isAuthenticated,
      setUnauthenticated: setUnauthenticated,
      setAuthenticated: setAuthenticated,
      getRoleLinks: getRoleLinks,
      login: login,
      logout: logout
    };

    return service;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * checkPrivilege
     * @description Returns true if currentUser's group matches given level bro
     * @param level
     */
    function checkPrivilege(level) {
      return _.has(service.currentUser, 'group') && service.currentUser.group.level === level;
    }

    /**
     * isAdmin
     * @description Returns true if user is an admin
     * @returns {boolean}
     */
    function isAdmin() {
      return checkPrivilege(1);
    }

    /**
     * isCoordinator
     * @description Returns true if user is a coordinator
     * @returns {boolean}
     */
    function isCoordinator() {
      return checkPrivilege(1);
    }

    /**
     * isSubject
     * @description Returns true if user is a subject
     * @returns {boolean}
     */
    function isSubject() {
      return checkPrivilege(3);
    }

    /**
     * isAdminPage
     * @description Returns true if requested page is an admin-only page.
     * @param link to page
     */
    function isAdminPage(page) {
      return _.contains(ADMIN_PAGES, page);
    }

    /**
     * isAuthenticated
     * @description Checks cookie and fires events depending on whether user is authenticated
     * @return {Boolean}
     */
    function isAuthenticated() {
      var auth = Boolean($cookies.get('user'));
      if (!auth) {
        setUnauthenticated();
      } else {
        setAuthenticated();
      }
      return auth;
    }

    /**
     * setUnauthenticated
     * @description Fires events to app (dados-header) to remove main/sub menus from view
     */
    function setUnauthenticated() {
      $cookies.remove('user');
      delete service.currentUser;
      $rootScope.$broadcast("events.unauthorized");
      $location.url('/login');
    }

    /**
     * setAuthenticated
     * @description Once authenticated, retrieve user's associated main/submenu options
     *              from response, or from angular constant settings
     */
    function setAuthenticated() {
      service.currentUser = $cookies.getObject('user');
      var view = service.currentUser.group.name.toString().toUpperCase();
      service.tabview = $cookies.getObject('user').group.tabview || TABVIEW[view];
      service.subview = $cookies.getObject('user').group.subview || SUBVIEW[view];
      $rootScope.$broadcast("events.authorized");
    }

    /**
     * getRoleLinks
     * @description Depending on user's role, context submenu is filtered down based on access level.
     * @param  {Array} links  response links from HATEOAS
     * @return {Array}        filtered submenu links
     */
    function getRoleLinks(baseRel, links) {
      return _.filter(links, function(link) {
        return _.contains(service.subview[baseRel], link.rel);
      });
    }

    /**
     * login
     * @description Service function called from auth controller to handle actual POST to /auth/local
     * @param  {Object} data      passed credentials for login
     * @param  {Function} onSuccess success callback
     * @param  {Function} onError   error callback
     * @return {Null}
     */
    function login(data, onSuccess, onError) {
      var state = new LoginAuth(data);
      state.$save().then(onSuccess).catch(onError);
    }

    /**
     * logout
     * @description Service function for invalidating token and removes cookie
     */
    function logout(data, onSuccess, onError) {
      setUnauthenticated();
      $cookies.remove('user');
      return $resource(Auth.LOGOUT_API, {}, {
        'query' : {method: 'GET', isArray: false }
      }).query();
    }

  }
})();
