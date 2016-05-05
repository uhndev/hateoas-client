(function() {
  'use strict';
  angular
    .module('altum.servicevariation')
    .controller('VariationModalController', VariationModalController);

  VariationModalController.$inject = ['$scope', '$uibModalInstance', 'displayMode', 'Variation', 'Selection', 'AltumAPIService', 'toastr'];

  function VariationModalController($scope, $uibModalInstance, displayMode, Variation, Selection, AltumAPI, toastr) {
    var vm = this;

    // bindable variables
    vm.serviceVariation = Variation;
    vm.selection = Selection;
    vm.displayMode = displayMode;
    vm.omitTypes = ['menu'];

    // bindable methods
    vm.collapseAll = collapseAll;
    vm.expandAll = expandAll;
    vm.saveVariations = saveVariations;
    vm.cancel = cancel;
    vm.add = add;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * collapseAll
     * @description Broadcasts event to collapse all nodes in the ui-tree
     */
    function collapseAll() {
      $scope.$broadcast('angular-ui-tree:collapse-all');
    }

    /**
     * expandAll
     * @description Broadcasts event to expand all nodes in the ui-tree
     */
    function expandAll() {
      $scope.$broadcast('angular-ui-tree:expand-all');
    }

    /**
     * saveVariations
     * @description Click handler for the save button in the variation modal window.
     *              Button will be enabled if and only if the internal ng-form within the
     *              variations-editor is $valid.
     */
    function saveVariations() {
      if (!vm.displayMode) {
        var method = (_.has(vm.serviceVariation, 'id') ? 'update' : 'save');
        AltumAPI.ServiceVariation[method](vm.serviceVariation, function (data) {
          toastr.success('Successfully saved variation ' + vm.serviceVariation.name, 'Variations');
          $uibModalInstance.close(vm.serviceVariation);
        });
      } else {
        $uibModalInstance.close(vm.selection);
      }
    }

    /**
     * cancel
     * @description Cancels and closes the modal window
     */
    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

    /**
     * add
     * @description adds a top level node
     */
    function add() {
      var newNode={nodes:[],title:'Options',type:'none'};
      vm.serviceVariation.variations.unshift(newNode);
    }
  }
})();
