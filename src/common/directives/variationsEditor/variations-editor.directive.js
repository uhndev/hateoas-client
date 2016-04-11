(function() {
  'use strict';
  angular
    .module('dados.common.directives.variationsEditor', [])
    .constant('VARIATION_TYPES', [
      {
        name: 'None',
        type: 'none',
        preset: false,
        value: null
      },
      {
        name: 'Service',
        type: 'service',
        preset: true,
        value: {
          altumService: null,
          programService: null
        }
      },
      {
        name: 'Number',
        type: 'number',
        preset: false,
        value: 0
      },
      {
        name: 'Text',
        type: 'text',
        preset: false,
        value: ''
      },
      {
        name: 'Date',
        type: 'date',
        preset: false,
        value: null
      },
      {
        name: 'Physician',
        type: 'physician',
        preset: false,
        value: null
      },
      {
        name: 'Staff',
        type: 'staff',
        preset: false,
        value: null
      },
      {
        name: 'Measure',
        type: 'measure',
        preset: false,
        value: {
          type: null,
          quantity: null,
          price: null,
          dimension: null
        }
      },
      {
        name: 'Menu',
        type: 'menu',
        preset: true,
        value: {
          prompt: '',
          href: '',
          icon: ''
        }
      }
    ])
    .controller('VariationsEditorController', VariationsEditorController)
    .component('variationsEditor', {
      bindings: {
        variations: '=',
        isValid: '='
      },
      controller: 'VariationsEditorController',
      controllerAs: 'varedit',
      templateUrl: 'directives/variationsEditor/variations-editor.tpl.html'
    });

  VariationsEditorController.$inject = ['$scope', 'VARIATION_TYPES'];

  function VariationsEditorController($scope, VARIATION_TYPES) {
    var vm = this;

    // bindable variables
    vm.variationTypes = VARIATION_TYPES;
    vm.variations = vm.variations || {};

    // bindable methods
    vm.remove = remove;
    vm.toggle = toggle;
    vm.newSubItem = newSubItem;
    vm.applyTypeChange = applyTypeChange;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * remove
     * @description Click handler for removing a node from the ui-tree.
     * @param scope
     */
    function remove(scope) {
      scope.remove();
    }

    /**
     * toggle
     * @description Click handler for opening/closing a node in the ui-tree.
     * @param scope
     */
    function toggle(scope) {
      scope.toggle();
    }

    /**
     * newSubItem
     * @description Click handler for appending a node to the current node
     * @param scope
     */
    function newSubItem(scope) {
      var nodeData = scope.$modelValue;
      nodeData.nodes.push({
        id: nodeData.id * 10 + nodeData.nodes.length,
        title: nodeData.title + ' ' + (nodeData.nodes.length + 1),
        nodes: [],
        type: 'none'
      });
    }

    /**
     * applyTypeChange
     * @description Function that is called whenever a variation type changes in the select field.
     * @param node
     */
    function applyTypeChange(node) {
      node.data = angular.copy(_.find(vm.variationTypes, {type: node.type}));
    }

    /**
     * watchFormValidity
     * @description Sets up a watch expression on the ng-form validity flags and passes through
     *              value to the bound isValid variable in the variations-editor directive.
     */
    function watchFormValidity(newVal, oldVal) {
      vm.isValid = newVal;
    }
    $scope.$watch('varedit.treeForm.$valid', watchFormValidity);
  }
})();
