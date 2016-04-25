/**
 * @name variations-picker
 * @description Directive for picking variation objects (mostly JSON arrays), used for service variations.
 * @example <variations-picker variations="serviceVariation.variations" selection="selection"></variations-picker>
 */

(function() {
  'use strict';
  angular
    .module('dados.common.directives.variationsPicker', [
      'dados.common.directives.variationsEditor'
    ])
    .controller('VariationsPickerController', VariationsPickerController)
    .component('variationsPicker', {
      bindings: {
        variations: '=',
        selection: '='
      },
      controller: 'VariationsPickerController',
      controllerAs: 'varpicker',
      templateUrl: 'directives/variationsPicker/variations-picker.tpl.html'
    });

  VariationsPickerController.$inject = [];

  function VariationsPickerController() {
    var vm = this;

    // bindable variables
    vm.variations = vm.variations || {};
    vm.selection = vm.selection || {};

    // bindable methods
    vm.toggle = toggle;
    vm.selectNode = selectNode;
    vm.updateMetaDataField = updateMetaDataField;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * toggle
     * @description Click handler for opening/closing a node in the ui-tree.
     * @param scope
     */
    function toggle(scope) {
      scope.toggle();
    }

    /**
     * selectNode
     * @description Click handler for selecting a node to be bound back to vm.selections
     */
    function selectNode(node) {
      // if id set in selection, we want to deselect the node
      if (_.has(vm.selection[node.type], 'id') && vm.selection[node.type].id === node.id) {
        delete vm.selection[node.type];
      } else {
        var nodeCopy = angular.copy(node);
        var selectedNode = {
          id: nodeCopy.id,
          title: nodeCopy.title,
          name: nodeCopy.title,
          value: nodeCopy.data.value
        };
        // update titles and names slightly for physisian/staff to display meaningful data
        if (node.type === 'physician' || node.type === 'staff') {
          selectedNode.name = nodeCopy.data.value.displayName;
          selectedNode.value = nodeCopy.data.value.id;
        }

        // otherwise enforce only one selection for each type variation
        vm.selection[node.type] = selectedNode;
      }
    }

    /**
     * updateMetaDataField
     * @description On change handler for metadata fields that may have already been selected
     * @param node
     */
    function updateMetaDataField(node) {
      if (_.has(vm.selection[node.type], 'id') && vm.selection[node.type].id === node.id) {
        vm.selection[node.type] = {
          id: node.id,
          name: angular.copy(node.title),
          value: angular.copy(node.data.value)
        };
      }
    }
  }
})();
