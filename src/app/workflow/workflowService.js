angular.module('dados.workflow.service', ['ngResource'])
       .constant('WORKFLOWSTATE_API', 'http://localhost:1337/api/workflowState')
       .factory('Workflow', 
         ['WORKFLOWSTATE_API', '$resource',
function WorkflowStateService (url, $resource) {
  'use strict';
  var api = $resource(url);

  return $resource(url + '/:id', {id : '@id'}, {
    'update' : { method: 'PUT' }
  });
}]);
