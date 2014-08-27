angular.module('dados.answerset',
            ['ui.router',
             'hateoas.controller'
            ])
       .constant('ANSWERSET_API', 'http://localhost:1337/api/answerset')
       .config(['$stateProvider',
function workflowRoute ($stateProvider) {
  'use strict';
  $stateProvider
    .state('answerset', {
      url: '/answerset',
      views : {
        'main': {
          templateUrl: 'hateoasClient/hateoas.tpl.html',
          controller: 'HateoasController'
        }
      },
      data:{ pageTitle: 'Answer Set' },
      resolve: {
        Resource: function($resource, ANSWERSET_API) {
          return $resource(ANSWERSET_API);
        },
        Actions: function($rootScope, $resource, ANSWERSET_API) {
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
                Resource: $resource(ANSWERSET_API)
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
              if (confirm('Are you sure you want to delete answerset: ' + 
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
