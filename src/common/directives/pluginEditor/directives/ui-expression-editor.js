/** 
 * 
 */
(function() {
  'use strict';

  angular
    .module('dados.common.directives.pluginEditor.directives.uiExpressionEditor', [
      'dados.common.directives.pluginEditor.expressionController'
    ])
    .directive('uiExpressionEditor', uiExpressionEditor);

  uiExpressionEditor.$inject = [];

  function uiExpressionEditor() {
    
    return {
      templateUrl: 'directives/pluginEditor/partials/UiExpressionEditor.tpl.html',
      controller: 'ExpressionController',
      restrict: 'E',
      replace: true,
			require: 'ngModel',
      scope: {
				inputs: '&',
				expression: '=ngModel'
      },
    };
  }

})();
