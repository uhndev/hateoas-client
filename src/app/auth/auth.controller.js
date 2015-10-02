/**
 * Controller for handling authentication of users
 */
(function() {
  'use strict';

  angular
    .module('dados.auth.controller', [
      'ngCookies'
    ])
    .controller('AuthController', AuthController);

  AuthController.$inject = ['$location', '$state', '$cookies', 'AuthService'];

  function AuthController($location, $state, $cookies, AuthService) {
    var vm = this;
    vm.error = '';

    // check if already logged in
    if (AuthService.isAuthenticated()) {
      $location.url('/study');
      $state.go('hateoas');
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
        $location.url('/study');
        $state.go('hateoas');
      }
    };

    /**
     * [error]
     * Error callback on unsuccessful login
     * @param  {Object} err
     */
    var error = function(err) {
      vm.error = err;
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

