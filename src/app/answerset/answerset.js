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
      templateUrl: 'hateoasClient/hateoas.tpl.html',
      controller: 'HateoasController',
      data:{ pageTitle: 'Answer Set' },
      resolve: {
        Resource: function($resource, ANSWERSET_API) {
          return $resource(ANSWERSET_API);
        },
        Actions: function() {
          return {};
        }
      }
    });
}]);
