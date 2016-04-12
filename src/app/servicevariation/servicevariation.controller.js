(function() {
  'use strict';
  angular
    .module('altum.servicevariation', ['ui.tree'])
    .controller('ServiceVariationController', ServiceVariationController);

  ServiceVariationController.$inject = ['$scope', 'API', '$location', '$uibModal', 'AltumAPIService', 'toastr'];

  function ServiceVariationController($scope, API, $location, $uibModal, AltumAPI, toastr) {
    var vm = this;

    // bindable variables
    vm.allow = {};
    vm.selected = null;
    vm.query = {};
    vm.resource = {};
    vm.url = API.url() + $location.path();

    // bindable methods
    vm.openVariationModal = openVariationModal;
    vm.archiveVariation = archiveVariation;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * openVariationModal
     * @description Click handler for new/edit functionality for variations.  Will pass in
     *              an empty base variation if creating new.
     * @param canEdit
     */
    function openVariationModal(canEdit) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'servicevariation/variationModal.tpl.html',
        controller: 'VariationModalController',
        controllerAs: 'varmodal',
        bindToController: true,
        windowClass: 'variations-modal-window',
        resolve: {
          Variation: function() {
            return canEdit ? angular.copy(vm.selected) : {
              name: 'New Variation',
              variations: [
                {
                  id: 1,
                  title: 'Options',
                  nodes: [],
                  type: 'none'
                }
              ]
            };
          }
        }
      });

      modalInstance.result.then(function () {
        $scope.$broadcast('hateoas.client.refresh');
      });
    }

    /**
     * archiveVariation
     * @description Click handler for archiving a variation from the variations list view
     */
    function archiveVariation() {
      var conf = confirm('Are you sure you want to archive this variation?');
      if (conf) {
        var variation = new AltumAPI.ServiceVariation({id: vm.selected.id});
        return variation.$delete({id: vm.selected.id}).then(function () {
          toastr.success('Archived variation ' + vm.selected.name, 'Variation');
          $scope.$broadcast('hateoas.client.refresh');
        });
      }
    }

  }
})();
