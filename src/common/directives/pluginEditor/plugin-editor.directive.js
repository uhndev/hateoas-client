(function() {
  'use strict';
  angular
    .module('dados.common.directives.pluginEditor', [
      'dados.common.directives.pluginEditor.pluginController',
      'dados.common.directives.pluginEditor.layoutController',
      'dados.common.directives.pluginEditor.widgetController',
      'dados.common.directives.pluginEditor.directives.formMetaEditor',
      'dados.common.directives.pluginEditor.directives.uiWidget',
      'dados.common.directives.pluginEditor.directives.uiListEditor',
      'dados.common.directives.pluginEditor.directives.uiExpressionEditor',
      'dados.common.directives.pluginEditor.directives.uiGrid',
      'dados.common.directives.pluginEditor.directives.uiSortable',
      'dados.common.directives.pluginEditor.directives.uiHelp',
      'dados.common.directives.pluginEditor.directives.scrollPast',
      'dados.common.directives.pluginEditor.directives.ngName',
    ])
    .directive('pluginEditor', function() {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'directives/pluginEditor/plugin-editor.tpl.html',
        controller: 'PluginController'
      };
    });

})();
