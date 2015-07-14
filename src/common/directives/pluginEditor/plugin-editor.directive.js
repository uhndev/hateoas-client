(function() {
  'use strict';
  angular
    .module('dados.common.directives.pluginEditor', [
      'dados.common.directives.pluginEditor.pluginController',
      'dados.common.directives.pluginEditor.layoutController',
      'dados.common.directives.pluginEditor.widgetModalController',
      'dados.common.directives.pluginEditor.directives.formMetaEditor',
      'dados.common.directives.pluginEditor.directives.uiWidget',
      'dados.common.directives.pluginEditor.directives.uiListEditor',
      'dados.common.directives.pluginEditor.directives.uiGrid',
      'dados.common.directives.pluginEditor.directives.uiSortable',
      //'dados.common.directives.pluginEditor.directives.uiHelp',
    ])
    .directive('pluginEditor', function() {
      return {
        restrict: 'E',
        replace: true,
        link: postLink,
        templateUrl: 'directives/pluginEditor/plugin-editor.tpl.html',
        controller: 'PluginController'
      };
    });
    
    function postLink(scope, element, attribute, controller) {
    }
})();
