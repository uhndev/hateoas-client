/** 
 * 
 */
(function() {
  'use strict';

  angular
    .module('dados.common.directives.pluginEditor.directives.uiHelp', [
    ])
    .directive('uiHelp', uiHelp);

  uiHelp.$inject = [];

  function uiHelp() {
    
    return {
      template: '<span class="glyphicon glyphicon-question-sign" ' +
                'popover-trigger="mouseenter"></span>',
      restrict: 'E',
      replace: true,
      scope: {
        message: '='
      },
    };
  }

})();