angular.module('dados.workflow.service', ['ngResource'])
       .constant('WORKFLOWSTATE_API', 'http://localhost:1337/api/workflowState')
       .factory('Workflow', 
         ['WORKFLOWSTATE_API', '$resource',
function WorkflowStateService (url, $resource) {
  'use strict';
  var Workflow = $resource(url + '/:id', {id : '@id'}, {
    'update' : { method: 'PUT' }
  });

  Workflow.set = function(data) {
    var state = new Workflow(data);
    if (_.has(state, 'id')) {
      state.$update();
    } else {
      state.$save();
    }
    return state;
  };

  Workflow.archive = function(data) {
    if (_.has(data, 'id')) {
      return Workflow.remove(data);
    }
    return null;
  };

  return Workflow;
}]);
