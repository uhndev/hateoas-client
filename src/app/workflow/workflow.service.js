(function() {
  'use strict';

  angular
    .module('dados.workflow.service', ['ngResource', 'toastr'])
    .constant('WORKFLOWSTATE_API', 'http://localhost:1337/api/workflowState')
    .factory('Workflow', WorkflowStateService);

  WorkflowStateService.$inject = ['WORKFLOWSTATE_API', '$resource', 'toastr'];

  function WorkflowStateService(url, $resource, toastr) {
    var Workflow = $resource(url + '/:id', {id : '@id'}, {
      'query': { method: 'GET', isArray: false },
      'update' : { method: 'PUT' }
    });

    Workflow.set = function(data) {
      var state = new Workflow(data);
      if (_.has(state, 'id')) {
        state.$update().then(function(data) {
          toastr.success('Successfully updated workflow!', 'Workflow');
        }).catch(function(err) {
          toastr.error(err, 'Workflow');
        });
      } else {
        state.$save().then(function(data) {
          toastr.success('Successfully created workflow!', 'Workflow');
        }).catch(function(err) {
          toastr.error(err, 'Workflow');
        });
      }
      return state;
    };

    Workflow.archive = function(data) {
      if (_.has(data, 'id')) {
        var state = new Workflow(data);
        state.$delete().then(function(data) {
          toastr.success('Successfully archived workflow!', 'Workflow');
        }).catch(function(err) {
          toastr.error(err, 'Workflow');
        });
        return state;
      }
      return null;
    };

    return Workflow;
  }

})();
