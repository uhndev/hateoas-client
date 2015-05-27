(function() {
  'use strict';
  
  angular
    .module('dados.auth.service', [
      'ngCookies',
      'ipCookie',
      'ngResource'
    ])
    .constant('LOGIN_API', 'http://localhost:1337/auth/local')
    .constant('LOGOUT_API', 'http://localhost:1337/logout')
    .service('AuthService', AuthService);

  AuthService.$inject = [
    'LOGIN_API', 'LOGOUT_API', '$rootScope', '$location',
    '$resource', '$cookieStore', 'ipCookie'
  ]; 

  function AuthService(loginURL, logoutURL, $rootScope, $location,
                      $resource, $cookieStore, ipCookie) {
    
    var LoginAuth = $resource(loginURL);

    this.isAuthenticated = function() {
      var auth = Boolean(ipCookie('user'));      
      if (!auth) {
        this.setUnauthenticated();
      } else {
        this.setAuthenticated();
      }
      return auth;
    };

    this.setUnauthenticated = function() {
      ipCookie.remove('user');
      delete this.currentUser;
      delete this.currentRole;      
      $rootScope.$broadcast("events.unauthorized");
      $location.url('/login');
    };

    this.setAuthenticated = function() {
      this.currentUser = ipCookie('user');
      this.currentRole = ipCookie('user').role;
      $rootScope.$broadcast("events.authorized");
    };

    this.login = function(data, onSuccess, onError) {
      var state = new LoginAuth(data);
      state.$save().then(onSuccess).catch(onError);
    };

    this.logout = function(data, onSuccess, onError) {      
      this.setUnauthenticated();
      // $cookieStore.remove('user');
      return $resource(logoutURL).query();
    };
  }  
})();