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
    vm.openServicePicker = openServicePicker;

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

    /**
     * openServicePicker
     * @description opens a modal window for the recommendations picker to add adhoc services
     */
    function openServicePicker() {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'variations-modal-window',
        templateUrl: 'referral/billing/addServicesModal.tpl.html',
        controller: function (PickerConfig, $q, $resource, API, $uibModalInstance, RecommendationsService, toastr) {
          var vm = this;

          // bindable variables
          vm.picker = PickerConfig;
          vm.searchQuery = null;
          // configuration object for the service-editor component
          vm.serviceEditorConfig = {
            disabled: {
              altumService: true,
              programService: true,
              site: true,
              visitService: true
            },
            required: {}
          };

          // bindable methods
          vm.saveRecommendedServices = saveRecommendedServices;
          vm.cancel = cancel;

          /////////////////////////////////////////////////////////////////////

          /**
           * saveRecommendedServices
           * @description Adds recommended services to the referral
           */
          function saveRecommendedServices() {
            var ReferralServices = $resource([API.url(), 'referral', vm.picker.referral.id, 'services'].join('/'));
            $q.all(_.map(vm.picker.recommendedServices, function (service) {
                var serviceObj = new ReferralServices(RecommendationsService.prepareService(service));
                return serviceObj.$save();
              }))
              .then(function (data) {
                toastr.success('Added services to referral for client: ' + vm.picker.referral.client_displayName, 'Billing');
                $uibModalInstance.close(data);
              });
          }

          /**
           * cancel
           * @description cancels and closes the modal window
           */
          function cancel() {
            $uibModalInstance.dismiss('cancel');
          }
        },
        controllerAs: 'adhoc',
        bindToController: true,
        resolve: {
          PickerConfig: function () {
            return {
              referral: $scope.services.referral,
              service: $scope.services.sharedService,
              currIndex: $scope.services.currIndex,
              availableServices: $scope.services.referral.availableServices,
              recommendedServices: $scope.services.recommendedServices,
              config: vm.recommendationsConfig
            };
          }
        }
      });

      modalInstance.result.then(function (adhocServices) {
        console.log(adhocServices);
        $scope.services.init();
      });
    }
  }

})();
