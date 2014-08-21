angular.module('dados.person',
            ['ui.router',
             'hateoas.controller'
            ])
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
        Resource: function($resource) {
          return $resource('http://localhost:1337/api/person');
        },
        Actions: function() {
          return {
            // Actions to be mapped to the form-popup directive
            ok: function() {
              console.log('OK CALLBACK');
            },
            cancel: function() {
              console.log('CANCEL CALLBACK');
            },
            // Actions to be mapped to the allow-nav directive
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
