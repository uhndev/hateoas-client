(function() {
  'use strict';
  angular
    .module('dados.common.directives.pluginEditor', [
      'dados.common.directives.pluginController'
    ])
    .directive('PluginBuilder', function() {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          query: '=ngModel',
          template: '&'
        },
        link: postLink,
        templateUrl: 'directives/queryBuilder/plugin-editor.tpl.html',
        controller: 'PluginController'
      };
    });

    function postLink(scope, element, attribute, controller) {
    
    }
})();
