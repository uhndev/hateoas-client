angular.module('dados.auth.service', ['ngResource'])
       .constant('LOGIN_API', 'http://localhost:1337/auth/login')
       .constant('REGISTER_API', 'http://localhost:1337/auth/register')
       .service('AuthService', ['LOGIN_API', 'REGISTER_API', '$resource',
  function AuthService(loginURL, registerURL, $resource) {
    'use strict';
    
    var LoginAuth    = $resource(loginURL);
    var RegisterAuth = $resource(registerURL);
	
	this.authorized = false;

    this.login = function(data, onSuccess, onError) {
      var state = new LoginAuth(data);
      state.$save().then(onSuccess).catch(onError);
    };

    this.register = function(data, onSuccess, onError) {
      var state = new RegisterAuth(data);
      state.$save().then(onSuccess).catch(onError);
    };
  }
]);