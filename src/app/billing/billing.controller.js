(function() {
  'use strict';

  angular
    .module('altum.billing', ['altum.referral.serviceGroup'])
    .constant('SERVICE_FIELDS', [
      'altumServiceName', 'programServiceName', 'programName',
      'siteName', 'code', 'price', 'payorName', 'serviceDate',
      'visitService', 'statusName', 'completionStatusName', 'billingStatusName'
    ])
    .controller('GlobalBillingController', GlobalBillingController);

  GlobalBillingController.$inject = ['$scope', '$resource', 'SERVICE_FIELDS', 'API'];

  function GlobalBillingController($scope, $resource, SERVICE_FIELDS, API) {
    var vm = this;

    // bindable variables
    vm.query = {'where': {}};
    vm.template = {};

    vm.accordionStatus = {};
    vm.boundGroupTypes = {
      groupBy: 'billingStatusName',
      subGroupBy: 'siteName'
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
      {name: 'groupBy', prompt: 'Group'},
      {name: 'subGroupBy', prompt: 'Subgroup'}
    ];

    // data columns for main groups (visits)
    vm.groupFields = [
      {
        name: 'serviceGroupByDate',
        prompt: 'COMMON.MODELS.SERVICE.SERVICE_DATE'
      },
      {
        name: 'statusName',
        prompt: 'COMMON.MODELS.SERVICE.CURRENT_STATUS'
      },
      {
        name: 'completionStatusName',
        prompt: 'COMMON.MODELS.SERVICE.COMPLETION_STATUS'
      },
      {
        name: 'siteName',
        prompt: 'COMMON.MODELS.SERVICE.SITE'
      },
      {
        name: 'altumServiceName',
        prompt: 'COMMON.MODELS.SERVICE.ALTUM_SERVICE'
      },
      {
        name: 'physician_displayName',
        prompt: 'COMMON.MODELS.SERVICE.PHYSICIAN'
      }
    ];

    // data columns for groups (visits)
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
        name: 'programServiceName',
        prompt: 'COMMON.MODELS.SERVICE.PROGRAM_SERVICE'
      },
      {
        name: 'altumServiceName',
        prompt: 'COMMON.MODELS.SERVICE.ALTUM_SERVICE'
      },
      {
        name: 'billing',
        prompt: 'COMMON.MODELS.SERVICE.BILLING_STATUS',
        type: 'status'
      }
    ];

    // bindable methods
    vm.init = init;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Resource = $resource(API.url() + '/servicedetail');

      Resource.get(vm.query, function (data) {
        vm.resource = data;

        // remove extraneous template fields
        vm.resource.template.data = _.filter(vm.resource.template.data, function (field) {
          return _.contains(SERVICE_FIELDS, field.name);
        });

        // parse serviceDate dates and add serviceGroupByDate of just the day to use as group key
        vm.services = _.map(vm.resource.items, function (service) {
          service.serviceGroupByDate = moment(service.serviceDate).startOf('day').format('dddd, MMMM Do YYYY');
          service.serviceDate = moment(service.serviceDate).format('MMM D, YYYY h:mm a');
          service.visitServiceName = (service.visitService) ? service.visitService.displayName : '-';
          return service;
        });
      });
    }

    // watch query-builder to filter down service details
    $scope.$watchCollection('globalBilling.query.where', function(newQuery, oldQuery) {
      if (newQuery && !_.isEqual(newQuery, oldQuery)) {
        init();
      }
    });
  }

})();
