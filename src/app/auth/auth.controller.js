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

  AuthController.$inject = ['$location', '$state', '$cookies', 'AuthService','toastr'];

  function AuthController($location, $state, $cookies, AuthService, toastr) {
    var vm = this;
    vm.error = '';

    // check if already logged in
    if (!AuthService.isAuthenticated()) {
      $location.url('/login');
      $state.go('login');
    }

    /**
     * [success]
     * Success callback following attempted login by user; on success, user info and token
     * are stored in cookie with expiration set in ms. Furthermore if it is the first time the user
     * is logging on, they will be redirected to update page to change thier password
     * @param  {Object} user response from server containing user, group, and token
     * @return {Null}
     */
    var success = function(user) {
      if (user) {
        var now = new Date();
        $cookies.putObject('user', user, {
          expires: new Date(now.getTime() + (3600000 * user.token.expires))
        });
        AuthService.setAuthenticated();
        if (user.user.firstLogin) {
          $location.url('/user/' + user.user.id);
          $state.go('hateoas');
          toastr.warning('Please change the initial password');
        }
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
     */
    vm.login = function() {
      AuthService.login(vm.credentials, success, error);
    };

  }

})();
