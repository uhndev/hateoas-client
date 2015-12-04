(function() {
  'use strict';

  angular
    .module('dados.common.directives.pluginEditor.expressionModalController', [
    ])
    .controller('ExpressionModalController', ExpressionModalController);

  ExpressionModalController.$inject = ['$scope', '$uibModalInstance', 'title', 'fieldNames', 'expression'];

  function ExpressionModalController($scope, $uibModalInstance, title, fieldNames, expression) {
    $scope.title = title;
    $scope.fieldNames = fieldNames;
    $scope.expression = expression;

    $scope.save = function(expression) {
      var result = '';

      if (angular.isArray(expression)) {
        result = expression.join(' ');
      } else {
        result = expression;
      }

      if ( (result.length === 0) || (result === 'false') ) {
        result = undefined;
      }

      $uibModalInstance.close(result);
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }

})();
