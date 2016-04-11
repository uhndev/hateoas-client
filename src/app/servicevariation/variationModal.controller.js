(function() {
  'use strict';
  angular
    .module('altum.servicevariation')
    .controller('VariationModalController', VariationModalController);

  VariationModalController.$inject = ['$scope', '$uibModalInstance', 'Variation', 'AltumAPIService', 'toastr'];

  function VariationModalController($scope, $uibModalInstance, Variation, AltumAPI, toastr) {
    var vm = this;

    // bindable variables
    vm.serviceVariation = Variation;

    // bindable methods
    vm.collapseAll = collapseAll;
    vm.expandAll = expandAll;
    vm.saveVariations = saveVariations;
    vm.cancel = cancel;

    ///////////////////////////////////////////////////////////////////////////

    function collapseAll() {
      $scope.$broadcast('angular-ui-tree:collapse-all');
    }

    function expandAll() {
      $scope.$broadcast('angular-ui-tree:expand-all');
    }

    function saveVariations() {
      var method = (_.has(vm.serviceVariation, 'id') ? 'update' : 'save');
      AltumAPI.ServiceVariation[method](vm.serviceVariation, function (data) {
        toastr.success('Successfully saved variation ' + vm.serviceVariation.name, 'Variations');
        $uibModalInstance.close(vm.serviceVariation);
      });
    }

    /**
     * cancel
     * @description cancels and closes the modal window
     */
    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }
  }
})();
