(function() {
  'use strict';
  angular
    .module('dados.workflow.controller', [])
    .constant('DEFAULT_LINK', {
      path: '',
      links: [],
      queries: [],
      template: {}
    })
    .controller('WorkflowController', WorkflowController);

  WorkflowController.$inject = ['$scope', '$filter', 'DEFAULT_LINK', 'Workflow'];

  function WorkflowController($scope, $filter, DEFAULT_LINK, Workflow) {

    $scope.workflows = Workflow.query();
    $scope.selected = null;   // Selected workflow state

    var DEFAULT_STATE = {
      source: null,
      data: angular.copy(DEFAULT_LINK),
      string: $filter('json')(DEFAULT_LINK)
    };
    $scope.state = angular.copy(DEFAULT_STATE);

    $scope.save = Workflow.set;
    $scope.archive = Workflow.archive;

    $scope.$watch('state.source.path', function(path) {
      if (!!path) {
        $scope.state.data = angular.copy($scope.state.source);
      } else {
        $scope.state = angular.copy(DEFAULT_STATE);
      }
    });

    $scope.$watch('state.data', function(json) {
      if (json) {
        $scope.state.string = $filter('json')(json);
      }
    }, true);

    $scope.$watch('state.string', function(json) {
      try {
        $scope.state.data = JSON.parse(json);
        $scope.wellFormed = true;
      } catch(e) {
        $scope.wellFormed = false;
      }
    });
  }

})();