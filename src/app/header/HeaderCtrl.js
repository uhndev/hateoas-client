/**
 * Module for controlling the header on each page;
 * uses the Menus service to track and add menu items based on role
 */

angular.module('dados.header', [
    'dados.common.services.authentication',
    'dados.auth.service'
])

.controller('HeaderCtrl', 
    ['$scope', '$location', 'AuthService', 
    /**
     * [HeaderCtrl - controller for managing header items]
     * @param {[type]} $scope
     * @param {[type]} Menus - service for managing menuItems
     * @param {[type]} Authentication - factory for checking authentication
     */
    function ($scope, $location, AuthService) {
        $scope.AuthService = AuthService;

        $scope.navigation = [
          { prompt: 'Studies', href: '/study', icon: 'fa-group' },
          { prompt: 'Form', href: '/form', icon: 'fa-file-o' },
          { prompt: 'Answers', href: '/answerset', icon: 'fa-archive' },
          { prompt: 'People', href: '/person', icon: 'fa-male' },
          { prompt: 'User Manager', href: '/user', icon: 'fa-user' },
          { prompt: 'Form Builder', href: '/formbuilder', icon: 'fa-pencil-square-o' },
          { prompt: 'Workflow Editor', href: '/workflow', icon: 'fa-code' },

        ];

        if (!AuthService.authorized) {
            $scope.headerVisible = false;
            $location.url('/login');
        }

        function updateActive() {
          var href = $location.path();
          _.each($scope.navigation, function(link) {
            link.isActive = 
              (href.toLowerCase() === link.href.toLowerCase());
          });
        }

        $scope.$on('$locationChangeSuccess', updateActive);
        updateActive();
    }
]);
