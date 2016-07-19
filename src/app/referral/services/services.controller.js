(function () {
  'use strict';

  angular
    .module('altum.referral.services', [
      'ngMaterial',
      'ngResource',
      'toastr',
      'dados.header.service',
      'dados.common.services.altum',
      'altum.referral.serviceStatus',
      'altum.referral.serviceGroup',
      'altum.referral.serviceGroupPreset'
    ])
    .controller('ServicesController', ServicesController);

  ServicesController.$inject = [
    '$resource', '$location', '$uibModal', 'API', 'HeaderService', 'AltumAPIService', 'RecommendationsService'
  ];

  function ServicesController($resource, $location, $uibModal, API, HeaderService, AltumAPI, RecommendationsService) {
    var vm = this;

    var templateFilterFields = [
      'programServiceName', 'programName', 'payorName', 'workStatusName', 'prognosisName',
      'prognosisTimeframeName', 'billingGroupName', 'billingGroupItemLabel', 'itemCount', 'completionDate',
      'totalItems', 'approvalDate', 'physicianDisplayName', 'currentCompletionPhysicianName', 'currentCompletionStaffName',
      'statusName', 'completionStatusName', 'billingStatusName', 'reportStatusName'
    ];

    vm.DEFAULT_GROUP_BY = 'statusName';
    vm.DEFAULT_SUBGROUP_BY = 'siteName';

    // bindable variables
    vm.url = API.url() + $location.path();
    vm.accordionStatus = {};
    vm.boundGroupTypes = {
      groupBy: vm.DEFAULT_GROUP_BY,
      subGroupBy: vm.DEFAULT_SUBGROUP_BY
    };

    // object of flags to be managed in referral-summary
    vm.flagConfig = {
      fields: false
    };

    // data columns for subgroups (encounter) summary table
    vm.summaryFields = [
      {
        name: 'workStatusName',
        prompt: 'COMMON.MODELS.SERVICE.WORK_STATUS'
      },
      {
        name: 'prognosisName',
        prompt: 'COMMON.MODELS.SERVICE.PROGNOSIS'
      },
      {
        name: 'prognosisTimeframeName',
        prompt: 'COMMON.MODELS.SERVICE.PROGNOSIS_TIMEFRAME'
      }
    ];

    // array of options denoting which groups can be bound to (vm.boundGroupTypes.groupBy)
    vm.groupTypes = [
      {name: 'groupBy', prompt: 'APP.REFERRAL.SERVICES.LABELS.GROUP'},
      {name: 'subGroupBy', prompt: 'APP.REFERRAL.SERVICES.LABELS.SUBGROUP'}
    ];

    // data columns for main groups (visits)
    vm.groupFields = [
      {
        name: 'statusName',
        prompt: 'APP.REFERRAL.SERVICES.LABELS.CURRENT_STATUS'
      },
      {
        name: 'completionStatusName',
        prompt: 'APP.REFERRAL.SERVICES.LABELS.COMPLETION_STATUS'
      },
      {
        name: 'billingStatusName',
        prompt: 'APP.REFERRAL.SERVICES.LABELS.BILLING_STATUS'
      },
      {
        name: 'siteName',
        prompt: 'APP.REFERRAL.SERVICES.LABELS.SITE'
      },
      {
        name: 'altumServiceName',
        prompt: 'APP.REFERRAL.SERVICES.LABELS.ALTUM_SERVICE'
      },
      {
        name: 'physician_displayName',
        prompt: 'APP.REFERRAL.SERVICES.LABELS.PHYSICIAN'
      },
      {
        name: 'serviceGroupByDate',
        prompt: 'APP.REFERRAL.SERVICES.LABELS.SERVICE_DATE'
      },
      {
        name: 'completionGroupByDate',
        prompt: 'APP.REFERRAL.SERVICES.LABELS.COMPLETION_DATE'
      }
    ];

    vm.billingGroupFields = angular.copy(vm.groupFields).concat([{
      name: 'billingGroupName',
      prompt: 'COMMON.MODELS.SERVICE.BILLING_GROUP'
    }]);

    // configure visit fields for referral services subgroup tables and add statuses
    vm.visitFields = [
      {
        name: 'altumServiceName',
        prompt: 'APP.REFERRAL.SERVICES.LABELS.ALTUM_SERVICE',
        type: 'string'
      },
      {
        name: 'physician_displayName',
        prompt: 'APP.REFERRAL.SERVICES.LABELS.PHYSICIAN',
        type: 'string'
      },
      {
        name: 'siteName',
        prompt: 'APP.REFERRAL.SERVICES.LABELS.SITE',
        type: 'string'
      },
      {
        name: 'visitServiceName',
        prompt: 'APP.REFERRAL.SERVICES.LABELS.VISIT_SERVICE',
        type: 'string'
      },
      {
        name: 'serviceDate',
        prompt: 'APP.REFERRAL.SERVICES.LABELS.SERVICE_DATE',
        type: 'datetime'
      },
      {
        name: 'report',
        prompt: 'APP.REFERRAL.SERVICES.LABELS.REPORT_STATUS',
        type: 'status'
      },
      {
        name: 'approval',
        prompt: 'APP.REFERRAL.SERVICES.LABELS.APPROVALS',
        type: 'status'
      },
      {
        name: 'completion',
        prompt: 'APP.REFERRAL.SERVICES.LABELS.COMPLETION',
        type: 'status'
      },
      {
        name: 'serviceEditor',
        prompt: 'APP.REFERRAL.SERVICES.LABELS.EDIT',
        type: 'button',
        iconClass: 'glyphicon-edit',
        onClick: openServiceEditor
      },
      {
        name: 'serviceEditor',
        prompt: 'APP.REFERRAL.SERVICES.LABELS.RECOMMEND_FROM',
        type: 'button',
        iconClass: 'glyphicon-plus',
        onClick: openRecommendationsPicker
      }
    ];

    vm.init = init;
    vm.openServiceEditor = openServiceEditor;
    vm.openRecommendationsPicker = openRecommendationsPicker;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Resource = $resource(vm.url);

      Resource.get(function (data, headers) {
        vm.referral = angular.copy(data.items);

        // email fields for sending email from note directive
        vm.emailInfo = {
          template: 'referral',
          data: {
            claim: vm.referral.claimNumber,
            client: vm.referral.client_displayName
          },
          options: {
            subject: 'Altum CMS Communication'
          }
        };

        // setup array of fields to choose from for referral services
        vm.templateFieldOptions = vm.templateFieldOptions || _.filter(data.template.data, function (field) {
          return _.contains(templateFilterFields, field.name);
        });
        // setup array of fields to choose from for referral billing (creates a clone of repeating elements for billing)
        vm.billingFieldOptions = _.cloneDeep(vm.billingFieldOptions || _.reject(vm.templateFieldOptions, function (field) {
          return _.contains(['billingCount'], field.name);
        }));
        // changes the prompt values for templateFields and billing fields so that the path is correct
        vm.templateFieldOptions.map(function (element) { element.prompt = 'APP.REFERRAL.SERVICES.LABELS.' + element.prompt.toUpperCase().replace(/ /gi,'_'); });
        vm.billingFieldOptions.map(function (element) { element.prompt = 'APP.REFERRAL.BILLING.LABELS.' + element.prompt.toUpperCase().replace(/ /gi,'_'); });

        // parse serviceDate dates and add serviceGroupByDate of just the day to use as group key
        vm.services = _.map(data.items.recommendedServices, function (service) {
          service.serviceGroupByDate = service.serviceDate ? moment(service.serviceDate).startOf('day').format('dddd, MMMM Do YYYY') : 'null';
          service.serviceDate = service.serviceDate ? moment(service.serviceDate).format('MMM D, YYYY h:mm a') : '-';
          service.completionGroupByDate = service.completionDate ? moment(service.completionDate).utc().format('dddd, MMMM Do YYYY') : 'null';
          service.completionDate = service.completionDate ? moment(service.completionDate).utc().format('MMM D, YYYY') : '-';
          return service;
        });

        // initialize submenu
        HeaderService.setSubmenu('referral', data.links);

        if (vm.referral.program) {
          vm.recommendedServices = [];
          vm.referral.availableServices = RecommendationsService.parseAvailableServices({}, data.items.availableServices);
        }
      });
    }

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
        size: 'lg',
        bindToController: true,
        resolve: {
          Service: function() {
            return AltumAPI.Service.get({id: service.id, populate: ['staff', 'visitService']}).$promise;
          },
          ApprovedServices: function() {
            return angular.copy(vm.referral.approvedServices);
          },
          ServiceEditorConfig: function() {
            return {
              loadVisitServiceData: false, // don't load in previous visit service data when editing on billing page
              disabled: {
                currentCompletion: true, // no need to have completion field when editing,
                payorPrice: true
              },
              required: {}
            };
          }
        }
      });

      modalInstance.result.then(function (updatedService) {
        init();
      });
    }

    /**
     * openRecommendationsPicker
     * @description opens a modal window for the recommendations picker to add adhoc services
     */
    function openRecommendationsPicker(selectedService) {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'variations-modal-window',
        templateUrl: 'referral/billing/addServicesModal.tpl.html',
        controller: function (PickerConfig, $q, $resource, API, $uibModalInstance, RecommendationsService, toastr) {
          var vm = this;
          var billingGroup = PickerConfig.service.billingGroup;

          // bindable variables
          vm.picker = PickerConfig;
          vm.searchQuery = null;
          // configuration object for the service-editor component
          vm.serviceEditorConfig = {
            loadVisitServiceData: true,
            disabled: {
              altumService: true,
              programService: true,
              variations: true,
              payorPrice: true,
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
              billingGroup: billingGroup,
              newBillingGroups: _.map(vm.picker.recommendedServices, function (service) {
                service.referral = vm.picker.referral.id;
                service.approvalNeeded = false;
                service.billingGroup = billingGroup;
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
              referral: vm.referral,
              service: selectedService,
              currIndex: vm.currIndex,
              availableServices: vm.referral.availableServices,
              recommendedServices: vm.referral.recommendedServices,
              config: {
                showBillingInfo: false,
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
        init();
      });
    }
  }

})();
