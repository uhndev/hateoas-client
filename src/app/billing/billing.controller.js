(function() {
  'use strict';

  angular
    .module('altum.billing', [
      'ui.sortable',
      'altum.referral.serviceGroup',
      'altum.referral.serviceGroupPreset'
    ])
    .constant('GLOBAL_BILLING_TEMPLATE_FIELDS', [
      'programServiceName', 'programName', 'payorName', 'siteName', 'workStatusName', 'prognosisName',
      'prognosisTimeframeName', 'serviceDate', 'visitServiceName', 'billingGroupName', 'billingGroupItemLabel', 'itemCount',
      'currentCompletionPhysicianName', 'currentCompletionStaffName', 'completionDate',
      'totalItems', 'approvalDate', 'statusName', 'completionStatusName', 'billingStatusName', 'physicianDisplayName'
    ])
    .controller('GlobalBillingController', GlobalBillingController);

  GlobalBillingController.$inject = ['$scope', '$resource', 'API', 'QueryParser', 'GLOBAL_BILLING_TEMPLATE_FIELDS'];

  function GlobalBillingController($scope, $resource, API, QueryParser, GLOBAL_BILLING_TEMPLATE_FIELDS) {
    var vm = this;
    var serviceOmitFields = ['createdAt', 'updatedAt', 'createdBy', 'displayName', 'iconClass', 'rowClass'];

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
        name: 'client_displayName',
        prompt: 'COMMON.MODELS.SERVICE.CLIENT'
      },
      {
        name: 'code',
        prompt: 'COMMON.MODELS.PROGRAM_SERVICE.CODE'
      },
      {
        name: 'payorPrice',
        prompt: 'COMMON.MODELS.SERVICE.PAYOR_PRICE',
        type: 'price'
      },
      {
        name: 'altumServiceName',
        prompt: 'COMMON.MODELS.SERVICE.ALTUM_SERVICE'
      },
      {
        name: 'billingCount',
        prompt: 'COMMON.MODELS.SERVICE.BILLING_COUNT'
      },
      {
        name: 'billingstatus',
        prompt: 'COMMON.MODELS.SERVICE.BILLING_STATUS',
        type: 'status'
      }
    ];

    // bindable methods
    vm.init = init;
    vm.onPageChange = onPageChange;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Resource = $resource(API.url() + '/servicedetail');

      Resource.get(vm.query, function (data) {
        vm.resource = data;

        // remove extraneous template fields
        vm.resource.template.data = vm.resource.template.data || _.reject(vm.resource.template.data, function (field) {
          return _.contains(serviceOmitFields, field.name);
        });

        // setup array of fields to choose from in template-config
        vm.templateFieldOptions = vm.templateFieldOptions || _.filter(vm.resource.template.data, function (field) {
          return _.contains(GLOBAL_BILLING_TEMPLATE_FIELDS, field.name);
        }).concat([
          {
            name: 'approval',
            prompt: 'COMMON.MODELS.SERVICE.APPROVAL',
            type: 'status'
          },
          {
            name: 'completion',
            prompt: 'COMMON.MODELS.SERVICE.COMPLETION',
            type: 'status'
          },
          {
            name: 'reportstatus',
            prompt: 'COMMON.MODELS.SERVICE.REPORT_STATUS',
            type: 'status'
          }
        ]);

        // parse serviceDate dates and add serviceGroupByDate of just the day to use as group key
        vm.services = _.map(vm.resource.items, function (service) {
          service.serviceGroupByDate = service.serviceDate ? moment(service.serviceDate).startOf('day').format('dddd, MMMM Do YYYY') : 'null';
          service.serviceDate = service.serviceDate ? moment(service.serviceDate).format('MMM D, YYYY h:mm a') : '-';
          service.completionGroupByDate = service.completionDate ? moment(service.completionDate).utc().format('dddd, MMMM Do YYYY') : 'null';
          service.completionDate = service.completionDate ? moment(service.completionDate).utc().format('MMM D, YYYY') : '-';
          service.visitServiceName = (service.visitService) ? service.visitService.displayName : '-';

          // conditionally disable edit buttons depending on ACLs set on servicedetail
          if (_.has(data.template, 'where') && _.has(data.template.where, 'update')) {
            service.updateDisabled = !QueryParser.evaluate(data.template.where.update, service);
          }
          return service;
        });
      });
    }

    /**
     * onPageChange
     * @description On change handler for pagination controls, will recalculate skip value for waterline query
     */
    function onPageChange() {
      vm.query.skip = ((vm.page - 1) * vm.query.limit);
    }

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
    $scope.$watchCollection('globalBilling.query', watchQuery);
  }

})();
