(function() {
  'use strict';

  angular
    .module('dados.workflow.service', ['ngResource', 'toastr', 'dados.workflow.constants'])
    .factory('Workflow', WorkflowStateService);

  WorkflowStateService.$inject = ['WORKFLOWSTATE_API', '$resource', 'toastr'];

  function WorkflowStateService(WORKFLOWSTATE_API, $resource, toastr) {
    var Workflow = $resource(WORKFLOWSTATE_API.url + '/:id', {id : '@id'}, {
      'query': { method: 'GET', isArray: false },
      'update' : { method: 'PUT' }
    });

    Workflow.set = function(data) {
      var state = new Workflow(data);
      if (_.has(state, 'id')) {
        state.$update().then(function(data) {
          toastr.success('Successfully updated workflow!', 'Workflow');
        });
      } else {
        state.$save().then(function(data) {
          toastr.success('Successfully created workflow!', 'Workflow');
        });
      }
      return state;
    };

    Workflow.archive = function(data) {
      if (_.has(data, 'id')) {
        var state = new Workflow(data);
        state.$delete().then(function(data) {
          toastr.success('Successfully archived workflow!', 'Workflow');
        });
        return state;
      }
      return null;
    };

    return Workflow;
  }

})();
