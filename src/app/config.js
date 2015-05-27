(function() {
  'use strict';
  angular.module('config.interceptors', [])
  .factory('httpRequestInterceptor', function($q, $location) {
    return {
      'responseError': function(rejection) {
        if (rejection.status == 403) {
          $location.path('/login');
          return $q.reject(rejection);
        }

        if (rejection.status >= 400 && rejection.status < 500) {
          $location.path('/400');
          return $q.reject(rejection);
        }

        if (rejection.status > 500) {
          $location.path('/500');
          return $q.reject(rejection);
        }
      }
    };
  });
})();