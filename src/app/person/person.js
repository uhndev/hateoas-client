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
        Actions: function($resource) {
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
              return {
                item: null,
                Resource: $resource('http://localhost:1337/api/person')
              };
            },
            'update': function(item) {
              console.log("Updating ");
              console.log(item);
              return {
                item: item,
                Resource: $resource(item.href, {}, {
                  'update' : { method: 'PUT' }
                })
              };              
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
