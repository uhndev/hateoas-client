(function() {
  'use strict';

  angular.module('dados.auth', [
    'ngCookies',
    'dados.auth.constants',
    'dados.auth.service',
    'dados.auth.controller'
  ])
  .config(function config( $stateProvider, $translatePartialLoaderProvider ) {
    $translatePartialLoaderProvider.addPart('auth');

    $stateProvider
      .state( 'login', {
        url: '/login',
        controller: 'AuthController',
        controllerAs: 'auth',
        templateUrl: 'auth/login.tpl.html'
      });
  });

})();
