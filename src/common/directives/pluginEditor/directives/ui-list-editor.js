/**
 * element: ui-list-editor
 * 
 * This is a generic editor for list data. Provided an array, the list-editor
 * will manage a list of objects. A template object can be provided to define
 * the structure of the objects store in the list. If no template is provided,
 * then an array of objects with a name, value pair will be stored.
 * 
 * A "canEditProperties" flag will allow the client to modify the object structure
 * by creating, renaming, and deleting object properties.
 * 
 */
 
(function() {
  'use strict';

  angular
    .module('dados.common.directives.pluginEditor.directives.uiListEditor', [
      'dados.common.directives.pluginEditor.directives.uiWidget',
      'dados.common.directives.pluginEditor.uiListEditorController'
    ])
    .directive('uiListEditor', uiListEditor);

  uiListEditor.$inject = [];

  function uiListEditor() {
    
    return {
      templateUrl: 'directives/pluginEditor/partials/ListEditor.tpl.html',
      controller: 'UiListEditorController',
      restrict: 'E',
      replace: true,
      require: "^list",
      scope: {
        template: '&',
        canEditProperties: '&',
        list: '='
      },
    };
  }

})();