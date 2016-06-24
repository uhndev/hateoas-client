/**
 * @name template-config
 * @description Convenience component for managing a template array and a display array.
 * @example
 *    <template-config available-fields="availableFields"
 *                     visible-fields="visibleFields">
 *    </template-config>
 *
 */
(function() {
  'use strict';

  angular
    .module('dados.common.directives.templateConfig', ['ui.sortable'])
    .component('templateConfig', {
      bindings: {
        availableFields: '=',
        visibleFields: '='
      },
      templateUrl: 'directives/templateConfig/template-config.tpl.html',
      controller: 'TemplateConfigController',
      controllerAs: 'templateConfig'
    })
    .controller('TemplateConfigController', TemplateConfigController);

  TemplateConfigController.$inject = [];

  function TemplateConfigController() {
    var vm = this;

    vm.removeField = removeField;

    // configuration object for ui-sortable
    vm.sortingOptions = {
      'ui-floating': true,
      'cursor': 'move',
      'connectWith': '.template-container'
    };

    /**
     * removeField
     * @description On click handler for removing a field from visibleFields and adding it to availableFields
     * @param field
     * @param index
     */
    function removeField(field, index) {
      vm.visibleFields.splice(index, 1);
      vm.availableFields.push(field);
    }
  }

})();
