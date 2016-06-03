(function() {
  'use strict';

  angular
    .module('altum.billing', ['altum.referral.serviceGroup'])
    .controller('GlobalBillingController', GlobalBillingController);

  GlobalBillingController.$inject = ['$scope', '$resource', 'API'];

  function GlobalBillingController($scope, $resource, API) {
    var vm = this;
    var serviceOmitFields = ['createdAt', 'updatedAt', 'createdBy', 'displayName', 'iconClass', 'rowClass'];

    // bindable variables
    vm.query = {'where': {}};
    vm.template = {};

    vm.accordionStatus = {};
    vm.boundGroupTypes = {
      groupBy: 'billingStatusName',
      subGroupBy: 'siteName'
    };

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
        name: 'billingStatusName',
        prompt: 'COMMON.MODELS.SERVICE.BILLING_STATUS'
      },
      {
        name: 'siteName',
        prompt: 'COMMON.MODELS.SERVICE.SITE'
      },
      {
        name: 'client_displayName',
        prompt: 'COMMON.MODELS.SERVICE.CLIENT'
      },
      {
        name: 'programServiceName',
        prompt: 'COMMON.MODELS.SERVICE.PROGRAM_SERVICE'
      }
    ];

    // data columns for subgroups (encounter) summary table
    vm.summaryFields = [];

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
        vm.resource.template.data = _.reject(vm.resource.template.data, function (field) {
          return _.contains(serviceOmitFields, field.name);
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
    $scope.$watchCollection('globalBilling.query.where', watchQuery);
  }

})();
