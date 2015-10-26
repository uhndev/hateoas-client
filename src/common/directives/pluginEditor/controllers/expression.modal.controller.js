(function() {
  'use strict';

  angular
    .module('dados.common.directives.pluginEditor.expressionModalController', [
    ])
    .controller('ExpressionModalController', ExpressionModalController);

  ExpressionModalController.$inject = ['$scope', '$modalInstance', 'title', 'fieldNames', 'expression'];

  function ExpressionModalController($scope, $modalInstance, title, fieldNames, expression) {
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
      
      $modalInstance.close(result);
    };
    
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  }

})();
