/**
 * @name variations-editor
 * @description Directive for editing variation objects (mostly JSON arrays), used for service variations.
 * @example <variations-editor variations="serviceVariation.variations" is-valid="isValid"></variations-editor>
 */

(function() {
  'use strict';
  angular
    .module('dados.common.directives.variationsEditor', [])
    .constant('VARIATION_TYPES', [
      {
        name: 'None',
        type: 'none',
        category: 'basic',
        preset: false,
        value: null
      },
      {
        name: 'Service',
        type: 'service',
        category: 'jsonmodel',
        preset: true,
        value: {
          altumService: null,
          programService: null
        }
      },
      {
        name: 'Number',
        type: 'number',
        category: 'basic',
        preset: false,
        value: null
      },
      {
        name: 'Text',
        type: 'text',
        category: 'basic',
        preset: false,
        value: ''
      },
      {
        name: 'Date',
        type: 'date',
        category: 'basic',
        preset: false,
        value: null
      },
      {
        name: 'Physician',
        type: 'physician',
        category: 'model',
        preset: false,
        value: null
      },
      {
        name: 'Staff',
        type: 'staff',
        category: 'model',
        preset: false,
        value: null
      },
      {
        name: 'Timeframe',
        type: 'timeframe',
        category: 'model',
        preset: false,
        value: null
      },
      {
        name: 'Follow Up',
        type: 'followup',
        category: 'jsonmodel',
        preset: false,
        value: {
          physician: null,
          timeframe: null
        }
      },
      {
        name: 'Measure',
        type: 'measure',
        category: 'json',
        preset: false,
        value: {
          unit: null,
          quantity: null,
          pricePerUnit: null,
          measurement: null
        }
      },
      {
        name: 'Menu',
        type: 'menu',
        category: 'json',
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
        isValid: '=',
        omitTypes: '='
      },
      controller: 'VariationsEditorController',
      controllerAs: 'varedit',
      templateUrl: 'directives/variationsEditor/variations-editor.tpl.html'
    });

  VariationsEditorController.$inject = ['$scope', 'VARIATION_TYPES'];

  function VariationsEditorController($scope, VARIATION_TYPES) {
    var vm = this;

    // bindable variables
    vm.variationTypes = _.reject(VARIATION_TYPES, function (type) {
      return _.contains(vm.omitTypes, type.type);
    });
    vm.variations = vm.variations || {};

    // bindable methods
    vm.remove = remove;
    vm.toggle = toggle;
    vm.newSubItem = newSubItem;
    vm.applyTypeChange = applyTypeChange;
    vm.parseNode = parseNode;

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
      var newNode = {
        id: nodeData.id * 10 + nodeData.nodes.length,
        title: nodeData.title + ' ' + (nodeData.nodes.length + 1),
        nodes: [],
        type: nodeData.type || 'none',
        data: angular.copy(nodeData.data)
      };
      nodeData.nodes.push(newNode);
      scope.expand();
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
     * parseNode
     * @description Function called on initialization of node scope to perform node verification
     * @param node
     */
    function parseNode(node) {
      switch (node.type) {
        case 'date':
          if (angular.isString(node.data.value)) {
            node.data.value = new Date(node.data.value);
          }
          break;
        default: break;
      }
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
