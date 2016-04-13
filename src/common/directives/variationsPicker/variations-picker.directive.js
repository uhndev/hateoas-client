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
        // otherwise enforce only one selection for each type variation
        vm.selection[node.type] = {
          id: node.id,
          value: angular.copy(node.data.value)
        };
      }
    }
  }
})();
