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
    .service('AuthService', AuthService);

  AuthService.$inject = [
    'AUTH_API', '$rootScope', '$location', '$resource', '$cookieStore', 'TABVIEW', 'SUBVIEW'
  ]; 

  function AuthService(Auth, $rootScope, $location, $resource, $cookieStore, TABVIEW, SUBVIEW) {
    
    var LoginAuth = $resource(Auth.LOGIN_API);
    var self = this;

    /**
     * [isAuthenticated]
     * Checks cookie and fires events depending on whether user is authenticated
     * @return {Boolean} 
     */
    this.isAuthenticated = function() {
      var auth = Boolean($cookieStore.get('user'));
      if (!auth) {
        this.setUnauthenticated();
      } else {
        this.setAuthenticated();
      }
      return auth;
    };

    /**
     * [setUnauthenticated]
     * Fires events to app (dados-header) to remove main/sub menus from view
     */
    this.setUnauthenticated = function() {
      $cookieStore.remove('user');
      delete this.currentUser;
      $rootScope.$broadcast("events.unauthorized");
      $location.url('/login');
    };

    /**
     * [setAuthenticated]
     * Once authenticated, retrieve user's associated main/submenu options
     * from response, or from angular constant settings
     */
    this.setAuthenticated = function() {
      this.currentUser = $cookieStore.get('user');
      var view = this.currentUser.group.name.toString().toUpperCase();
      this.tabview = $cookieStore.get('user').group.tabview || TABVIEW[view];
      this.subview = $cookieStore.get('user').group.subview || SUBVIEW[view];
      $rootScope.$broadcast("events.authorized");
    };

    /**
     * [getRoleLinks]
     * Depending on user's role, context submenu is filtered down based on
     * access level.
     * @param  {Array} links  response links from HATEOAS
     * @return {Array}        filtered submenu links
     */
    this.getRoleLinks = function(links) {
      return _.filter(links, function(link) {
        return _.contains(self.subview, link.rel);
      });
    };

    /**
     * [login]
     * Service function called from auth controller to handle actual 
     * POST to /auth/local.  
     * @param  {Object} data      passed credentials for login
     * @param  {Function} onSuccess success callback
     * @param  {Function} onError   error callback
     * @return {Null}
     */
    this.login = function(data, onSuccess, onError) {
      var state = new LoginAuth(data);
      state.$save().then(onSuccess).catch(onError);
    };

    /**
     * [logout]
     * Service function for invalidating token and removes cookie
     */
    this.logout = function(data, onSuccess, onError) {      
      this.setUnauthenticated();
      $cookieStore.remove('user');
      return $resource(Auth.LOGOUT_API).query();
    };
  }  
})();