(function () {
  'use strict';

  angular
    .module('altum.referral.billing', [])
    .controller('BillingController', BillingController);

  BillingController.$inject = [
    '$uibModal', '$scope', 'AltumAPIService'
  ];

  function BillingController($uibModal, $scope, AltumAPI) {
    var vm = this;
    vm.DEFAULT_GROUP_BY = 'completionStatusName';
    vm.DEFAULT_SUBGROUP_BY = 'siteName';

    // bindable variables
    vm.boundGroupTypes = {
      groupBy: vm.DEFAULT_GROUP_BY,
      subGroupBy: vm.DEFAULT_SUBGROUP_BY
    };
    vm.recommendationsConfig = {
      showBillingInfo: true,
      labels: {
        'available': 'APP.REFERRAL.RECOMMENDATIONS.TABS.AVAILABLE_SERVICES',
        'recommended': 'APP.REFERRAL.RECOMMENDATIONS.TABS.SERVICES_TO_BE_ADDED'
      }
    };

    vm.openServiceEditor = openServiceEditor;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * openServiceEditor
     * @description opens a modal window for the serviceModal service editor
     */
    function openServiceEditor(service) {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'variations-modal-window',
        templateUrl: 'directives/modelEditors/serviceEditor/serviceModal.tpl.html',
        controller: 'ServiceModalController',
        controllerAs: 'svcmodal',
        bindToController: true,
        resolve: {
          Service: function() {
            return AltumAPI.Service.get({id: service.id, populate: 'staff'}).$promise;
          },
          ApprovedServices: function() {
            return angular.copy($scope.services.referral.approvedServices);
          }
        }
      });

      modalInstance.result.then(function (updatedService) {
        $scope.services.init();
      });
    }
  }

})();
