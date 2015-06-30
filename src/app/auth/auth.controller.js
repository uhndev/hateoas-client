/**
 * Module for handling authentication of users
 */

(function() {
  'use strict';

  angular
    .module('dados.auth.controller', [
      'ngCookies'
    ])
    .controller('AuthController', AuthController);

  AuthController.$inject = ['$location', '$state', '$cookieStore', 'AuthService', 'toastr'];

  function AuthController($location, $state, $cookieStore, AuthService, toastr) {
    var vm = this;
    vm.error = '';
    
    // check if already logged in
    if (AuthService.isAuthenticated()) {
      $location.url('/');
    }

    var success = function(user) {
      if (user) {
        var now = new Date();
        $cookieStore.put('user', user, {
          expires: new Date(now.getTime() + (60000 * user.expires))
        });
        AuthService.setAuthenticated();
        $location.url('/study');
        $state.go('hateoas');
      }
    };

    var error = function(err) {
      vm.error = err;
    };

    vm.login = function() {
      AuthService.login(vm.credentials, success, error);
    };

    vm.register = function(isValid) {
      if (isValid) {
        AuthService.register(vm.credentials, success, error);
      }
    };
  } 
  
})();

