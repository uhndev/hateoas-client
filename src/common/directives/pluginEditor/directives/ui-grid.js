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

  uiGrid.$inject = [];

  function uiGrid() {

    return {
      templateUrl: 'directives/pluginEditor/partials/UiGrid.tpl.html',
      controller: 'UiGridController',
      restrict: 'E',
      replace: true,
      scope: {
        selectedIndex: '=',
        cellIndex: '=',
        cellCount: '=',
        cell: '='
      }
    };
  }

})();
