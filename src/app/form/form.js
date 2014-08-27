angular.module( 'dados.form',
            ['ui.router',
             'hateoas.controller'
            ])
       .constant('FORM_API', 'http://localhost:1337/api/form')
       .constant('ANSWERSET_API', 'http://localhost:1337/api/answerset')
       .config(['$stateProvider',
function workflowRoute( $stateProvider ) {
  'use strict';
  $stateProvider
    .state( 'form', {
      url: '/form',
      views: {
        'main': {
          templateUrl: 'hateoasClient/hateoas.tpl.html',
          controller: 'HateoasController'
        }
      },
      data:{ pageTitle: 'Form' },
      resolve: {
        Resource: function($resource, FORM_API) {
          return $resource(FORM_API);
        },
        Actions: function($rootScope, $resource, $state, ANSWERSET_API) {
          return {
            // Actions to be mapped to the form-popup directive
            ok: function() {
              return {
                item: null,
                Resource: $resource(ANSWERSET_API)
              };
            },
            cancel: function() {
              console.log('CANCEL CALLBACK');
            },
            // Actions to be mapped to the allow-nav directive
            create: function() {
              $state.go('formbuilder');
            },
            update: function(item) {
              $state.go('formbuilder.edit', { formURL: item.href });
            },
            delete: function(item) {
              if (confirm('Are you sure you want to delete: ' + 
                           item.form_title + '?')) {
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
