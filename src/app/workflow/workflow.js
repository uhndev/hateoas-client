angular.module('dados.workflow',
            ['ui.ace',
             'ui.router',
             'dados.workflow.controller',
             'JSONedit'])
       .config(['$stateProvider',
function workflowRoute ($stateProvider) {
  'use strict';
  $stateProvider
    .state('workflow', {
      url: '/workflow',
      views : {
        'main': {
          templateUrl: 'workflow/workflow.tpl.html',
          controller: 'WorkflowController'
        }
      },
      data:{ pageTitle: 'Application Workflows' }
    });
}
       ]);
