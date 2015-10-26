/** 
 * 
 */
(function() {
  'use strict';

  angular
    .module('dados.common.directives.pluginEditor.directives.formMetaEditor', [
      'dados.common.directives.pluginEditor.metaDataController'
    ])
    .directive('formMetaEditor', uiGrid);

  uiGrid.$inject = [];

  function uiGrid() {
    
    return {
      templateUrl: 'directives/pluginEditor/partials/MetaDataEditor.tpl.html',
      restrict: 'E',
      replace: true,
    };
  }

})();
