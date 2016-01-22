(function() {
  'use strict';

  angular.module('dados.error', [])
    .config(function config($stateProvider) {
      $stateProvider
        .state('forbidden', {
          url: '/forbidden',
          templateUrl: 'error/forbidden/forbiddenView.tpl.html'
        })
        .state('notfound', {
          url: '/notfound',
          templateUrl: 'error/notfound/notfoundView.tpl.html'
        })
        .state('servererror', {
          url: '/servererror',
          templateUrl: 'error/servererror/servererrorView.tpl.html'
        });
    });

})();
