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
      views : {
        'main': {
          templateUrl: 'hateoasClient/hateoas.tpl.html',
          controller: 'HateoasController'
        }
      },
      data:{ pageTitle: 'Users' },
      resolve: {
        Resource: function($resource, USER_API) {
          return $resource(USER_API);
        },
        Actions: function($rootScope, $resource, USER_API) {
          return {
            // Actions that can be mapped to the form-popup directive
            ok: function() {
              console.log('OK CALLBACK');
            },
            cancel: function() {
              console.log('CANCEL CALLBACK');
            },
            // Actions that can be mapped to the allow-nav directive
            // returns payload to modalInstanceController
            'create': function() {
              return {
                item: null,
                Resource: $resource(USER_API)
              };
            },
            'update': function(item) {
              return {
                item: item,
                Resource: $resource(item.href, {}, {
                  'update' : { method: 'PUT' }
                })
              };              
            },
            'delete': function(item) {
              if (confirm('Are you sure you want to delete user: ' + 
                           item.firstName + ' ' + item.lastName + '?')) {
                $resource(item.href).remove()
                .$promise.then(function() {
                  $rootScope.$broadcast('hateoas.client.refresh');
                });
              }
            }
          };
        }
      }
    });
}]);
