(function () {
  'use strict';

  angular
    .module('altum.referral.billing', ['altum.referral.serviceGroup'])
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

    // data columns for groups (visits)
    vm.visitFields = [
      {
        name: 'altumServiceName',
        prompt: 'COMMON.MODELS.SERVICE.ALTUM_SERVICE'
      },
      {
        name: 'physician_displayName',
        prompt: 'COMMON.MODELS.SERVICE.PHYSICIAN'
      },
      {
        name: 'siteName',
        prompt: 'COMMON.MODELS.SERVICE.SITE'
      },
      {
        name: 'serviceDate',
        prompt: 'COMMON.MODELS.SERVICE.SERVICE_DATE'
      },
      {
        name: 'visitServiceName',
        prompt: 'COMMON.MODELS.SERVICE.VISIT_SERVICE'
      },
      {
        name: 'completion',
        prompt: 'COMMON.MODELS.SERVICE.COMPLETION',
        type: 'status'
      },
      {
        name: 'billing',
        prompt: 'COMMON.MODELS.SERVICE.BILLING_STATUS',
        type: 'status'
      },
      {
        name: 'serviceEditor',
        prompt: 'APP.REFERRAL.BILLING.LABELS.EDIT_SERVICE',
        type: 'button',
        iconClass: 'glyphicon-edit',
        onClick: openServiceEditor
      }
    ];

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
        templateUrl: 'directives/modelEditors/serviceEditor/serviceModal.tpl.html',
        controller: 'ServiceModalController',
        controllerAs: 'svcmodal',
        bindToController: true,
        resolve: {
          Service: function() {
            return AltumAPI.Service.get({id: service.id, populate: ['staff', 'visitService']}).$promise;
          },
          ApprovedServices: function() {
            return angular.copy($scope.services.referral.approvedServices);
          },
          ServiceEditorConfig: function() {
            return {
              loadVisitServiceData: false, // don't load in previous visit service data when editing on billing page
              disabled: {
                currentCompletion: true // no need to have completion field when editing
              },
              required: {}
            };
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
            $q.all(_.map(vm.picker.recommendedServices, function (service) {
                // set approval not needed and referral id
                service.referral = vm.picker.referral.id;
                service.approvalNeeded = false;
                var serviceObj = new AltumAPI.BillingGroup(RecommendationsService.prepareService(service));
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
        $scope.services.init();
      });
    }
  }

})();
