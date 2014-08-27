/**
 * Module for handling authentication of users
 */

angular.module( 'dados.auth', [
    'ui.router',
    'ui.bootstrap',
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

.controller('AuthController', ['$scope', '$window', '$location', 'AuthService', 'Authentication',
    function ($scope, $window, $location, AuthService, Authentication) {
        // check if already logged in
        if (Authentication.currentUser) {
            $location.url('/');
        }

        var success = function(user) { $window.location.href = '/'; };
        var error = function(err) { $scope.error = err; };

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