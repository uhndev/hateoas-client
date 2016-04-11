(function() {
  'use strict';
  angular
    .module('dados.common.directives.variationsEditor', [])
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

  VariationsEditorController.$inject = ['$scope'];

  function VariationsEditorController($scope) {
    var vm = this;

    // bindable variables
    vm.variationTypes = [
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
    ];
    vm.variations = vm.variations || {};

    // bindable methods
    vm.remove = remove;
    vm.toggle = toggle;
    vm.newSubItem = newSubItem;
    vm.applyTypeChange = applyTypeChange;

    ///////////////////////////////////////////////////////////////////////////

    function remove(scope) {
      scope.remove();
    }

    function toggle(scope) {
      scope.toggle();
    }

    function newSubItem(scope) {
      var nodeData = scope.$modelValue;
      nodeData.nodes.push({
        id: nodeData.id * 10 + nodeData.nodes.length,
        title: nodeData.title + ' ' + (nodeData.nodes.length + 1),
        nodes: [],
        type: 'none'
      });
    }

    function applyTypeChange(node) {
      node.data = angular.copy(_.find(vm.variationTypes, {type: node.type}));
    }

    $scope.$watch('varedit.treeForm.$valid', function (newVal, oldVal) {
      vm.isValid = newVal;
    });
  }
})();
