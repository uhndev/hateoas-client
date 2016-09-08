(function() {
  'use strict';

  angular
    .module('altum.billing', [
      'ui.sortable',
      'altum.referral.serviceGroup',
      'altum.referral.serviceGroupPreset'
    ])
    .constant('GLOBAL_BILLING_TEMPLATE_FIELDS', [
      'programServiceName', 'programName', 'payorName', 'siteName', 'workStatusName', 'prognosisName', 'MRN',
      'prognosisTimeframeName', 'serviceDate', 'visitServiceName', 'billingGroupName', 'billingGroupItemLabel', 'itemCount',
      'currentCompletionPhysicianName', 'currentCompletionStaffName', 'completionDate',
      'totalItems', 'approvalDate', 'statusName', 'completionStatusName', 'billingStatusName', 'physicianDisplayName'
    ])
    .controller('GlobalBillingController', GlobalBillingController);

  GlobalBillingController.$inject = ['$scope', '$resource', 'API', '$uibModal', 'QueryParser', 'GLOBAL_BILLING_TEMPLATE_FIELDS'];

  function GlobalBillingController($scope, $resource, API, $uibModal, QueryParser, GLOBAL_BILLING_TEMPLATE_FIELDS) {
    var vm = this;
    var serviceOmitFields = ['createdAt', 'updatedAt', 'createdBy', 'displayName', 'iconClass', 'rowClass'];
    var ServiceDetailResource = $resource(API.url() + '/servicedetail');

    // bindable variables
    vm.query = {
      where: {},
      sort: 'createdAt DESC',
      limit: 25,
      skip: 0
    };
    vm.page = 1;
    vm.template = {};

    vm.accordionStatus = {};
    vm.countsPerPage = [25, 50, 75, 100];
    vm.boundGroupTypes = {
      groupBy: 'client_displayName',
      subGroupBy: 'billingStatusName'
    };

    // array of options denoting which groups can be bound to (vm.boundGroupTypes.groupBy)
    vm.groupTypes = [
      {name: 'groupBy', prompt: 'Group'},
      {name: 'subGroupBy', prompt: 'Subgroup'}
    ];

    // data columns for main groups (visits)
    vm.groupFields = [
      {
        name: 'statusName',
        prompt: 'APP.GLOBAL_BILLING.LABELS.CURRENT_STATUS'
      },
      {
        name: 'completionStatusName',
        prompt: 'APP.GLOBAL_BILLING.LABELS.COMPLETION_STATUS'
      },
      {
        name: 'billingStatusName',
        prompt: 'APP.GLOBAL_BILLING.LABELS.BILLING_STATUS'
      },
      {
        name: 'siteName',
        prompt: 'APP.GLOBAL_BILLING.LABELS.SITE'
      },
      {
        name: 'programName',
        prompt: 'APP.GLOBAL_BILLING.LABELS.PROGRAM'
      },
      {
        name: 'payorName',
        prompt: 'APP.GLOBAL_BILLING.LABELS.PAYOR'
      },
      {
        name: 'programServiceName',
        prompt: 'APP.GLOBAL_BILLING.LABELS.PROGRAM_SERVICE'
      },
      {
        name: 'billingGroupName',
        prompt: 'APP.GLOBAL_BILLING.LABELS.BILLING_GROUP'
      },
      {
        name: 'client_displayName',
        prompt: 'APP.GLOBAL_BILLING.LABELS.CLIENT'
      },
      {
        name: 'serviceGroupByDate',
        prompt: 'APP.GLOBAL_BILLING.LABELS.SERVICE_DATE'
      },
      {
        name: 'completionGroupByDate',
        prompt: 'APP.GLOBAL_BILLING.LABELS.COMPLETION_DATE'
      }
    ];

    // data columns for subgroups (encounter) summary table
    vm.summaryFields = [];

    // configure visit fields for global billing subgroup tables and add billing status
    vm.visitFields = [
      {
        name: 'completionDate',
        prompt: 'APP.GLOBAL_BILLING.LABELS.COMPLETION_DATE'
      },
      {
        name: 'client_displayName',
        prompt: 'APP.GLOBAL_BILLING.LABELS.CLIENT'
      },
      {
        name: 'altumServiceName',
        prompt: 'APP.GLOBAL_BILLING.LABELS.ALTUM_SERVICE'
      },
      {
        name: 'code',
        prompt: 'APP.GLOBAL_BILLING.LABELS.CODE'
      },
      {
        name: 'siteName',
        prompt: 'APP.GLOBAL_BILLING.LABELS.SITE'
      },
      {
        name: 'physicianDisplayName',
        prompt: 'APP.GLOBAL_BILLING.LABELS.PHYSICIAN'
      },
      {
        name: 'payorPrice',
        prompt: 'APP.GLOBAL_BILLING.LABELS.PAYOR_PRICE',
        type: 'price'
      },
      {
        name: 'completion',
        prompt: 'APP.GLOBAL_BILLING.LABELS.COMPLETION',
        type: 'status'
      },
      {
        name: 'reportstatus',
        prompt: 'APP.GLOBAL_BILLING.LABELS.REPORT_STATUS',
        type: 'status'
      },
      {
        name: 'billingstatus',
        prompt: 'APP.GLOBAL_BILLING.LABELS.BILLING_STATUS',
        type: 'status'
      },
      {
        name: 'serviceEditor',
        prompt: 'APP.GLOBAL_BILLING.LABELS.EDIT',
        type: 'editButton',
        iconClass: 'glyphicon-edit',
        eventName: 'referralServices.openServiceEditor'
      }
    ];

    // bindable methods
    vm.init = init;
    vm.expandToggle = expandToggle;
    vm.onPageChange = onPageChange;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      vm.loadingData = true;
      ServiceDetailResource.get(vm.query, function (data) {
        vm.resource = data;

        // remove extraneous template fields
        vm.resource.template.data = _.reject(vm.resource.template.data, function (field) {
          return _.contains(serviceOmitFields, field.name) || _.stringContains(field.name, 'Detail');
        });

        // setup array of fields to choose from in template-config
        vm.templateFieldOptions = _.filter(vm.resource.template.data, function (field) {
          return _.contains(GLOBAL_BILLING_TEMPLATE_FIELDS, field.name);
        }).concat([
          {
            name: 'approval',
            prompt: 'APP.GLOBAL_BILLING.LABELS.APPROVAL',
            type: 'status'
          },
          {
            name: 'completion',
            prompt: 'APP.GLOBAL_BILLING.LABELS.COMPLETION',
            type: 'status'
          },
          {
            name: 'reportstatus',
            prompt: 'APP.GLOBAL_BILLING.LABELS.REPORT_STATUS',
            type: 'status'
          }
        ]);

        // changes the prompt values for templateFields and billing fields so that the path is correct
        vm.templateFieldOptions.map(function (element) { element.prompt = 'APP.GLOBAL_BILLING.LABELS.' + element.prompt.toUpperCase().replace(/ /gi,'_'); });

        // parse serviceDate dates and add serviceGroupByDate of just the day to use as group key
        vm.services = _.map(vm.resource.items, function (service) {
          service.serviceGroupByDate = service.serviceDate ? moment(service.serviceDate).startOf('day').format('dddd, MMMM Do YYYY') : 'null';
          service.serviceDate = service.serviceDate ? moment(service.serviceDate).format('MMM D, YYYY h:mm a') : '-';
          service.completionGroupByDate = service.completionDate ? moment(service.completionDate).utc().format('dddd, MMMM Do YYYY') : 'null';
          service.completionDate = service.completionDate ? moment(service.completionDate).utc().format('MMM D, YYYY') : '-';
          service.visitServiceName = (service.visitService) ? service.visitService.displayName : '-';

          // conditionally disable edit buttons depending on ACLs set on servicedetail
          service.updateDisabled = (_.has(data.template, 'where') && _.has(data.template.where, 'update')) ? !QueryParser.evaluate(data.template.where.update, service) : false;
          return service;
        });

        vm.loadingData = false;
      });
    }

    /**
     * expandToggle
     * @description Broadcasts event to the service-group directive to expand all subGroups
     */
    function expandToggle() {
      $scope.$broadcast('serviceGroup.expandToggle');
    }

    /**
     * onPageChange
     * @description On change handler for pagination controls, will recalculate skip value for waterline query
     */
    function onPageChange() {
      vm.query.skip = ((vm.page - 1) * vm.query.limit);
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
          Service: function($resource, API) {
            var ServiceResource = $resource(API.url() + '/service');
            return ServiceResource.get({id: service.id, populate: ['staff', 'visitService']}).$promise;
          },
          ApprovedServices: function() {
            return ServiceDetailResource.get({
              where: {
                referral: service.referral,
                statusName: 'Approved',
                visitable: true
              }
            }).$promise.then(function (data) {
              return data.items;
            });
          },
          ServiceEditorConfig: function() {
            return {
              loadVisitServiceData: false, // don't load in previous visit service data when editing on billing page
              disabled: {
                altumService: true,
                programService: true,
                serviceDate: true,
                currentCompletion: true  // no need to have completion field when editing
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
     * referralServices.openServiceEditor
     * @description Event listener for opening service editor
     */
    $scope.$on('referralServices.openServiceEditor', function (event, data) {
      openServiceEditor(data);
    });

    /**
     * watchQuery
     * @description watch query-builder to filter down service details
     * @param newQuery
     * @param oldQuery
     */
    function watchQuery(newQuery, oldQuery) {
      if (newQuery && !_.isEqual(newQuery, oldQuery)) {
        init();
      }
    }
    $scope.$watch('globalBilling.query', watchQuery, true);
  }

})();
