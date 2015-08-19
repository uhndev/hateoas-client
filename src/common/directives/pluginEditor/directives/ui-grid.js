/**
 * @name ui-grid
 * @description Directive representation of an individual grid element (question).
 *              Expects a question object from the array form.questions. This directive
 *              is used in plugin-editor.tpl.html as part of an ng-repeat.
 *
 * @example  <ui-grid ng-repeat="cell in questions track by $index"
                cell="cell"
                cell-count="grid.length"
                cell-index="$index"
                selected-index="selectedIndex">
             </ui-grid>
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
