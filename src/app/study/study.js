angular.module('dados.study', 
            ['ui.router',
             'hateoas.controller'
            ])
       .constant('STUDY_API', 'http://localhost:1337/api/study')
       .config(['$stateProvider',
function workflowRoute ($stateProvider) {
  'use strict';
  $stateProvider
    .state('study', {
      url: '/study',
      templateUrl: 'hateoasClient/hateoas.tpl.html',
      controller: 'HateoasController',
      data:{ pageTitle: 'Studies' },
      resolve: {
        Resource: function($resource, STUDY_API) {
          return $resource(STUDY_API);
        },
        Actions: function($resource, $rootScope) {
          return {
            'delete': function(item) {
              if (confirm('Are you sure you want to delete study: ' + 
                           item.name + '?')) {
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
