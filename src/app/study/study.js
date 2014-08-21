angular.module('dados.study',
            ['ui.router',
             'hateoas.controller'
            ])
       .config(['$stateProvider',
function workflowRoute ($stateProvider) {
  'use strict';
  $stateProvider
    .state('study', {
      url: '/study',
      views : {
        'main': {
          templateUrl: 'hateoasClient/hateoas.tpl.html',
          controller: 'HateoasController'
        }
      },
      data:{ pageTitle: 'Studies' },
      resolve: {
        Resource: function($resource) {
          return $resource('http://localhost:1337/api/study');
        },
        Actions: function() {
          return {
            'create': function() {
              console.log("Creating");
            },
            'update': function(item) {
              console.log("Updating " + item);
              console.log(item);
            },
            'delete': function(item) {
              console.log("Removing " + item);
              console.log(item);
            }
          };
        }
      }
    });
}
       ]);
