(function() {
  'use strict';

  angular
    .module('altum.billing', [
      'ui.sortable',
      'altum.referral.serviceGroup'
    ])
    .constant('GLOBAL_BILLING_TEMPLATE_FIELDS', [
      'programServiceName', 'programName', 'payorName', 'siteName', 'workStatusName', 'prognosisName',
      'prognosisTimeframeName', 'serviceDate', 'visitServiceName', 'billingGroupName', 'billingGroupItemLabel', 'itemCount',
      'totalItems', 'approvalDate', 'statusName', 'completionStatusName', 'billingStatusName', 'physicianDisplayName'
    ])
    .controller('GlobalBillingController', GlobalBillingController);

  GlobalBillingController.$inject = ['$scope', '$resource', 'API', 'GLOBAL_BILLING_TEMPLATE_FIELDS'];

  function GlobalBillingController($scope, $resource, API, GLOBAL_BILLING_TEMPLATE_FIELDS) {
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
        prompt: 'COMMON.MODELS.SERVICE.CURRENT_STATUS'
      },
      {
        name: 'completionStatusName',
        prompt: 'COMMON.MODELS.SERVICE.COMPLETION_STATUS'
      },
      {
        name: 'billingStatusName',
        prompt: 'COMMON.MODELS.SERVICE.BILLING_STATUS'
      },
      {
        name: 'siteName',
        prompt: 'COMMON.MODELS.SERVICE.SITE'
      },
      {
        name: 'programName',
        prompt: 'COMMON.MODELS.SERVICE.PROGRAM'
      },
      {
        name: 'payorName',
        prompt: 'COMMON.MODELS.PROGRAM.PAYOR'
      },
      {
        name: 'programServiceName',
        prompt: 'COMMON.MODELS.SERVICE.PROGRAM_SERVICE'
      },
      {
        name: 'client_displayName',
        prompt: 'COMMON.MODELS.SERVICE.CLIENT'
      },
      {
        name: 'serviceGroupByDate',
        prompt: 'COMMON.MODELS.SERVICE.SERVICE_DATE'
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
        name: 'price',
        prompt: 'COMMON.MODELS.PROGRAM_SERVICE.PRICE'
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
        name: 'billing',
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
          }
        ]);

        // parse serviceDate dates and add serviceGroupByDate of just the day to use as group key
        vm.services = _.map(vm.resource.items, function (service) {
          service.serviceGroupByDate = moment(service.serviceDate).startOf('day').format('dddd, MMMM Do YYYY');
          service.serviceDate = moment(service.serviceDate).format('MMM D, YYYY h:mm a');
          service.visitServiceName = (service.visitService) ? service.visitService.displayName : '-';
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
