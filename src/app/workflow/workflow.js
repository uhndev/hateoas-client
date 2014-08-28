angular.module('dados.workflow', 
  ['ui.ace', 'dados.workflow.controller', 'JSONedit'])
  .config(function WorkflowRouting($stateProvider) {
    $stateProvider.state({
      name: 'workflow',
      url: '/workflow',
      templateUrl: 'workflow/workflow.tpl.html',
      controller: 'WorkflowController',
      data: {
        pageTitle: 'Workflow Settings'
      }
    });
  });
