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
        value: null,
        values: []
      },
      {
        name: 'Service',
        type: 'service',
        category: 'jsonmodel',
        preset: true,
        value: {
          altumService: null,
          programService: null
        },
        values: []
      },
      {
        name: 'Number',
        type: 'number',
        category: 'basic',
        preset: false,
        value: null,
        values: []
      },
      {
        name: 'Text',
        type: 'text',
        category: 'basic',
        preset: false,
        value: '',
        values: []
      },
      {
        name: 'Date',
        type: 'date',
        category: 'basic',
        preset: false,
        value: null,
        values: []
      },
      {
        name: 'Physician',
        type: 'physician',
        category: 'model',
        preset: false,
        value: null,
        values: []
      },
      {
        name: 'Staff',
        type: 'staff',
        category: 'model',
        preset: false,
        value: null,
        values: []
      },
      {
        name: 'Timeframe',
        type: 'timeframe',
        category: 'model',
        preset: false,
        value: null,
        values: []
      },
      {
        name: 'Follow Up',
        type: 'followup',
        category: 'jsonmodel',
        preset: false,
        value: {
          physician: null,
          timeframe: null
        },
        values: []
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
        },
        values: []
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
        },
        values: []
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
    vm.newPreset = newPreset;
    vm.removePreset = removePreset;

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
    }

    /**
     * newPreset
     * @description applies the preset value to the values array
     * @param node
     */
    function newPreset(node) {
      console.log(node.data.value);
      node.data.values.push(node.data.value);
      node.data.value = _.find(VARIATION_TYPES,{type: node.type}).value;
    }

    /**
     * removePreset
     * @description removes preset value from values array
     * @param node
     */
    function removePreset(node,index) {
      _.pullAt(node.data.values,index);
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
