(function () {
  'use strict';

  angular
    .module('altum.referral.billing', ['altum.referral.serviceGroup', 'altum.referral.serviceGroupPreset'])
    .controller('BillingController', BillingController);

  BillingController.$inject = [
    '$uibModal', '$scope', 'AltumAPIService'
  ];

  function BillingController($uibModal, $scope, AltumAPI) {
    var vm = this;
    vm.DEFAULT_GROUP_BY = 'billingStatusName';
    vm.DEFAULT_SUBGROUP_BY = 'siteName';

    // bindable variables
    vm.boundGroupTypes = {
      groupBy: vm.DEFAULT_GROUP_BY,
      subGroupBy: vm.DEFAULT_SUBGROUP_BY
    };

    // data columns for groups (visits)
    vm.visitFields = [
      {
        name: 'altumServiceName',
        prompt: 'APP.REFERRAL.BILLING.LABELS.ALTUM_SERVICE',
        type: 'string'
      },
      {
        name: 'siteName',
        prompt: 'APP.REFERRAL.BILLING.LABELS.SITE',
        type: 'string'
      },
      {
        name: 'serviceDate',
        prompt: 'APP.REFERRAL.BILLING.LABELS.SERVICE_DATE',
        type: 'datetime'
      },
      {
        name: 'code',
        prompt: 'APP.REFERRAL.BILLING.LABELS.CODE',
        type: 'string'
      },
      {
        name: 'payorPrice',
        prompt: 'APP.REFERRAL.BILLING.LABELS.PAYOR_PRICE',
        type: 'price'
      },
      {
        name: 'billingCount',
        prompt: 'APP.REFERRAL.BILLING.LABELS.BILLING_COUNT',
        type: 'string'
      },
      {
        name: 'reportstatus',
        prompt: 'APP.REFERRAL.BILLING.LABELS.REPORT_STATUS',
        type: 'status'
      },
      {
        name: 'billingstatus',
        prompt: 'APP.REFERRAL.BILLING.LABELS.BILLING_STATUS',
        type: 'status'
      },
      {
        name: 'serviceEditor',
        prompt: 'APP.REFERRAL.BILLING.LABELS.EDIT_SERVICE',
        type: 'editButton',
        iconClass: 'glyphicon-edit',
        onClick: openServiceEditor
      }
    ];

    vm.openServiceEditor = openServicePicker;
    vm.openServicePicker = openServicePicker;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * openServiceEditor
     * @description opens a modal window for the billing specific serviceModal service editor
     */
    function openServiceEditor(service) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'directives/modelEditors/serviceEditor/serviceModal.tpl.html',
        controller: 'ServiceModalController',
        controllerAs: 'svcmodal',
        size: 'lg',
        bindToController: true,
        resolve: {
          Service: function($resource, API) {
            var ServiceResource = $resource(API.url() + '/service');
            return ServiceResource.get({id: service.id, populate: ['staff', 'visitService']}).$promise;
          },
          ApprovedServices: function() {
            return angular.copy($scope.services.referral.approvedServices);
          },
          ServiceEditorConfig: function() {
            return {
              loadVisitServiceData: false, // don't load in previous visit service data when editing on billing page
              disabled: {
                currentCompletion: true // no need to have completion field when editing,
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
              visitService: true,
              variations: true,
              serviceDate: true
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
            var BulkRecommendServices = $resource(API.url('billinggroup/bulkRecommend'), {}, {
              'save' : {method: 'POST', isArray: false}
            });
            var bulkRecommendServices = new BulkRecommendServices({
              newBillingGroups: _.map(vm.picker.recommendedServices, function (service) {
                service.referral = vm.picker.referral.id;
                service.approvalNeeded = false;
                return RecommendationsService.prepareService(service);
              })
            });

            bulkRecommendServices.$save(function (data) {
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
              config: {
                showBillingInfo: true,
                labels: {
                  'available': 'APP.REFERRAL.RECOMMENDATIONS.TABS.AVAILABLE_SERVICES',
                  'recommended': 'APP.REFERRAL.RECOMMENDATIONS.TABS.SERVICES_TO_BE_ADDED'
                }
              }
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
