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
      templateUrl: 'hateoasClient/hateoas.tpl.html',
      controller: 'HateoasController',
      data:{ pageTitle: 'People' },
      resolve: {
        Resource: function($resource, PERSON_API) {
          return $resource(PERSON_API);
        },
        Actions: function($resource, $rootScope) {
          return {
            // override delete cb in hateoasController; others defaulted
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
