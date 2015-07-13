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
          token = CookieStore.get('user').token.payload;
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

        // change $location for specific response codes
        switch (response.status) {
          case 400:
            if (response.data.name === 'UnauthorizedError' ||
                response.data.message === 'jwt expired') {
              $location.path('/login');
              $injector.get('AuthService').setUnauthenticated();
            }
            break;
          case 403: $location.path('/400'); break;
          case 404: $location.path('/400'); break;
          default: break;
        }

        // otherwise, try to parse error message from response object
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
