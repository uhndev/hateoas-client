(function() {
  'use strict';
  angular
    .module('dados.common.interceptors.httprequest', [])
    .factory('httpRequestInterceptor', httpRequestInterceptor)
    .config(function ($httpProvider) {
      $httpProvider.interceptors.push('httpRequestInterceptor');
    });

  httpRequestInterceptor.$inject = ['$q', '$location', '$injector'];

  function httpRequestInterceptor($q, $location, $injector) {
    var CookieStore = $injector.get('$cookieStore');

    return {

      /**
       * Inteceptor for all $http requests to add authentication header
       * @param  {*} config
       * @return {*}
       */
      request: function(config) {
        var token;
        if (_.has(CookieStore.get('user'), 'token')) {
          token = CookieStore.get('user').token;
        }
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },

      /**
       * Interceptor method which is triggered whenever response occurs on $http queries.
       * @param  {*} response 
       * @return {*|Promise}
       */
      response: function responseCallback(response) {
        if (response.data.error &&
          response.data.status &&
          response.data.status !== 200
        ) {
          return $q.reject(response);
        } else {
          return response || $q.when(response);
        }
      },

      /**
       * Interceptor method that is triggered whenever response error occurs on $http requests.
       * @param   {*} response
       * @returns {*|Promise}
       */
      responseError: function responseErrorCallback(response) {
        var message = '', title = 'Error';

        if (response.status === 400 || response.status === 404) {
          $location.path('/400');
        } else if (response.status === 403) {
          $location.path('/login');
        } else if (response.status === 500) {
          $location.path('/500');
        }

        if (response.data && response.data.error) {
          message = response.data.error;
        } else if (response.data && response.data.message && response.data.title) {
          title = response.data.title;
          message = response.data.message;
        } else {
          if (typeof response.data === 'string') {
            message = response.data;
          } else if (response.statusText) {
            message = response.statusText;
          } else {
            message = $injector.get('httpStatusService').getStatusCodeText(response.status);
          }

          message = message + ' (HTTP status ' + response.status + ')';
        }

        if (message) {
          $injector.get('toastr').error(message, title);
        }

        return $q.reject(response);
      }

    };
  }

})();