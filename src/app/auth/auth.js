/**
 * Module for handling authentication of users
 */

angular.module( 'dados.auth', [
    'ui.bootstrap',
    'ui.router',
    'dados.auth.service'
])


.config(function config( $stateProvider ) {
    $stateProvider
    .state( 'login', {
        url: '/login',
        controller: 'AuthController',
        templateUrl: 'auth/login.tpl.html',
        data: { pageTitle: 'Login' }
    })
    .state( 'register', {
        url: '/register',
        controller: 'AuthController',
        templateUrl: 'auth/register.tpl.html',
        data: { pageTitle: 'Register' }
    });
})


.controller('AuthController', ['$scope', '$window', '$location', '$state', 'AuthService',
    function ($scope, $window, $location, $state, AuthService) {
        // check if already logged in
        if (AuthService.authorized) {
            $location.url('/');
        }

        var success = function(user) {
			if(user.access != 'denied') {
				AuthService.authorized = true;
				$location.url('/study');
				$state.go('hateoas');
			}
		};
        var error = function(err) { 
			$scope.error = err;
		};

        $scope.login = function() {
            AuthService.login($scope.credentials, success, error);
        };

        $scope.register = function(isValid) {
            if (isValid) {
                AuthService.register($scope.credentials, success, error);
            }
        };
    } 
]);
