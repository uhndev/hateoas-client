angular.module('dados.person',
            ['ui.router',
             'hateoas.controller'
            ])
       .constant('PERSON_API', 'http://localhost:1337/api/person')
       .config(['$stateProvider',
function workflowRoute ($stateProvider) {
  'use strict';
  $stateProvider
    .state('person', {
      url: '/person',
      views : {
        'main': {
          templateUrl: 'hateoasClient/hateoas.tpl.html',
          controller: 'HateoasController'
        }
      },
      data:{ pageTitle: 'People' },
      resolve: {
        Resource: function($resource, PERSON_API) {
          return $resource(PERSON_API);
        },
        Actions: function($rootScope, $resource, PERSON_API) {
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
                Resource: $resource(PERSON_API)
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
              if (confirm('Are you sure you want to delete person: ' + 
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
