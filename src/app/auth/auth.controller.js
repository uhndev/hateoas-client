/**
 * Module for handling authentication of users
 */

(function() {
  'use strict';

  angular
    .module('dados.auth.controller', [
      'ngCookies',
      'ipCookie'
    ])
    .controller('AuthController', AuthController);

  AuthController.$inject = ['$location', '$state', '$cookieStore', 'ipCookie', 'AuthService', 'toastr'];

  function AuthController($location, $state, $cookieStore, ipCookie, AuthService, toastr) {
    var vm = this;
    vm.error = '';
    
    // check if already logged in
    if (AuthService.isAuthenticated()) {
      $location.url('/');
    }

    var success = function(user) {
      if (user) {
        var now = new Date();
        ipCookie('user', user, {
          expires: new Date(now.getTime() + 900000)
        });
        AuthService.setAuthenticated();

        // wait until stable angular 1.3 for cookie expiration support
        // $cookieStore.put('user', user, {
        //   expires: new Date(now.getTime() + 900000)
        // });
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

