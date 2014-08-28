angular.module('dados.user',
            ['ui.router',
             'hateoas.controller'
            ])
       .constant('USER_API', 'http://localhost:1337/api/user')
       .config(['$stateProvider',
function workflowRoute ($stateProvider) {
  'use strict';
  $stateProvider
    .state('user', {
      url: '/user',
      templateUrl: 'hateoasClient/hateoas.tpl.html',
      controller: 'HateoasController',
      data:{ pageTitle: 'Users' },
      resolve: {
        Resource: function($resource, USER_API) {
          return $resource(USER_API);
        },
        Actions: function() {
          return {};
        }
      }
    });
}]);
