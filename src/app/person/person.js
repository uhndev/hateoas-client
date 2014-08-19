angular.module('dados.person',
            ['ui.router',
             'ngTable',
             'dados.person.controller'])
       .config(['$stateProvider',
function workflowRoute ($stateProvider) {
  'use strict';
  $stateProvider
    .state('person', {
      url: '/person',
      views : {
        'main': {
          templateUrl: 'person/person.tpl.html',
          controller: 'PersonController'
        }
      },
      data:{ pageTitle: 'People' }
    });
}
       ]);
