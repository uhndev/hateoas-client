/**
 * Controller for handling authentication of users
 */
(function() {
  'use strict';

  angular
    .module('dados.auth.controller', [
      'dados.auth.constants',
      'ngCookies'
    ])
    .controller('AuthController', AuthController);

  AuthController.$inject = ['$location', '$state', '$cookies', 'DefaultRouteService', 'AuthService'];

  function AuthController($location, $state, $cookies, DefaultRouteService, AuthService) {
    var vm = this;
    vm.error = '';

    // check if already logged in
    if (AuthService.isAuthenticated()) {
      DefaultRouteService.route(AuthService.currentUser.group.level);
    } else {
      $location.url('/login');
      $state.go('login');
    }

    /**
     * [success]
     * Success callback following attempted login by user; on success, user info and token
     * are stored in cookie with expiration set in ms.
     * @param  {Object} user response from server containing user, group, and token
     * @return {Null}
     */
    var success = function(user) {
      if (user) {
        var now = new Date();
        $cookies.putObject('user', user, {
          expires: new Date(now.getTime() + (60000 * user.token.expires))
        });
        AuthService.setAuthenticated();
        DefaultRouteService.route(AuthService.currentUser.group.level);
      }
    };

    /**
     * [error]
     * Error callback on unsuccessful login
     * @param  {Object} err
     */
    var error = function(err) {
      vm.error = err;
      $location.url('/login');
      $state.go('login');
    };

    /**
     * [login]
     * Bound method to login button on form
     * @return {[type]} [description]
     */
    vm.login = function() {
      AuthService.login(vm.credentials, success, error);
    };

  }

})();

