/** 
 * 
 */
(function() {
  'use strict';

  angular
    .module('dados.common.directives.pluginEditor.directives.uiGrid', [
      'dados.common.directives.pluginEditor.uiGridController'
    ])
    .directive('uiGrid', uiGrid);

  uiGrid.$inject = ['$http', '$compile', '$templateCache'];

  function uiGrid($http, $compile, $templateCache) {
    
    return {
      templateUrl: 'directives/pluginEditor/partials/UiGrid.tpl.html',
      controller: 'UiGridController',
      restrict: 'E',
      replace: true,
      scope: {
        cellIndex: '=',
        cellCount: '=',
        cell: '='
      },
    };
  }

})();
