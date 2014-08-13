/**
 * Module for controlling the header on each page;
 * uses the Menus service to track and add menu items based on role
 */

angular.module('dados.header', ['dados.common.services.authentication'])

.controller('HeaderCtrl', 
    ['$scope', '$location', 'Authentication', 
    /**
     * [HeaderCtrl - controller for managing header items]
     * @param {[type]} $scope
     * @param {[type]} Menus - service for managing menuItems
     * @param {[type]} Authentication - factory for checking authentication
     */
    function ($scope, $location, Authentication) {
        $scope.currentUser = Authentication.currentUser;

        if (!$scope.currentUser) {
            $location.url('/login');
        }
    }
]);