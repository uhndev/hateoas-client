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
        $scope.headerVisible = true;
        $scope.currentHref = $location.path();

        $scope.navigation = [
          { prompt: 'Studies', href: '/study', icon: 'fa-group' },
          { prompt: 'Form', href: '/form', icon: 'fa-file-o' },
          { prompt: 'Answers', href: '/answerset', icon: 'fa-archive' },
          { prompt: 'People', href: '/person', icon: 'fa-male' },
          { prompt: 'User Manager', href: '/user', icon: 'fa-user' },
          { prompt: 'Form Builder', href: '/formbuilder', icon: 'fa-pencil-square-o' },
          { prompt: 'Workflow Editor', href: '/workflow', icon: 'fa-code' },

        ];

        if (!$scope.currentUser) {
            $scope.headerVisible = false;
            $location.url('/login');
        }

        $scope.$on('$locationChangeSuccess', function(e, current, prev) {
          $scope.currentHref = $location.path();
        });
    }
]);
