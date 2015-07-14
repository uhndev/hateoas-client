(function() {
  'use strict';
  angular
    .module('dados.common.interceptors.csrf', [])
    .factory('csrfRequestInterceptor', CsrfRequestInterceptor)
    .config(function ($httpProvider) {
      $httpProvider.interceptors.push('csrfRequestInterceptor');
    });

    CsrfRequestInterceptor.$inject = ['$q', '$injector', 'API'];    

    function CsrfRequestInterceptor($q , $injector, API) {
      var CSRF_URL = API.base() + '/csrfToken';
      var _token = false;
      return {
        request: function InterceptRequest(config){
          if (config.url == CSRF_URL || config.method == "GET"){
            return config;
          }

          // cookie timeouts require refetching of token
          // if (_token){ 
          //   config.data._csrf = _token;
          //   return config;
          // }
   
          var deferred = $q.defer();
          var $http = $injector.get('$http');
          $http.get(CSRF_URL).success(function (response , status , headers){
            if(response._csrf){
              _token = response._csrf;
              // config.data._csrf = _token;
              config.headers['X-CSRF-Token'] = response._csrf;
            }
            deferred.resolve(config);
          }).error(function (response , status , headers){
            deferred.reject(response);
          });

          return deferred.promise;
        }
      };
    }
})();
