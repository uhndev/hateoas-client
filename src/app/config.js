angular.module('config.interceptors', [])
  .factory('httpRequestInterceptor', function($q, $location) {
    var key = '';
	return {
		// optional method
		'request': function(config) {
		  // do something on success
		  var str = "http://localhost:1337/api";
		  if(config.url.substring( 0, str.length ) === str) {
			config.headers['x-dados-key'] = key;
		  }
		  return config;
		},
		
		// optional method
		'response': function(response) {
		  // do something on success
		  var str = "http://localhost:1337/api";
		  if(response.config.url.substring( 0, str.length ) === str) {
			key = response.headers('x-dados-key');
			console.log("Request key: " + response.config.headers['x-dados-key']);
			console.log("Response key: " + key);
		  }
		  return response;
		},
      'responseError': function(rejection) {
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
