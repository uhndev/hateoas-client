(function () {
  'use strict';

  angular
    .module('altum.referral.services', [
      'ngMaterial',
      'ngResource',
      'toastr',
      'dados.header.service',
      'dados.common.services.altum',
      'altum.referral.serviceApproval'
    ])
    .controller('ServicesController', ServicesController);

  ServicesController.$inject = [
    '$resource', '$location', 'API', 'HeaderService', 'AltumAPIService', 'toastr'
  ];

  function ServicesController($resource, $location, API, HeaderService, AltumAPI, toastr) {
    var vm = this;
    vm.DEFAULT_GROUP_BY = 'statusName';
    vm.DEFAULT_SUBGROUP_BY = 'siteName';

    // bindable variables
    vm.url = API.url() + $location.path();
    vm.referralNotes = [];
    vm.groupBy = vm.DEFAULT_GROUP_BY;
    vm.subGroupBy = vm.DEFAULT_SUBGROUP_BY;
    vm.approvalStatuses = AltumAPI.Status.query({where: {category: 'approval'}});
    vm.completionStatuses = AltumAPI.Status.query({where: {category: 'completion'}});
    vm.accordionStatus = {};

    // data columns for subgroups (encounter) summary table
    vm.summaryFields = [
      {
        name: 'workStatus',
        prompt: 'COMMON.MODELS.SERVICE.WORK_STATUS'
      },
      {
        name: 'prognosis',
        prompt: 'COMMON.MODELS.SERVICE.PROGNOSIS'
      },
      {
        name: 'prognosisTimeframe',
        prompt: 'COMMON.MODELS.SERVICE.PROGNOSIS_TIMEFRAME'
      }
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
      }
    ];

    vm.init = init;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Resource = $resource(vm.url);

      Resource.get(function (data, headers) {
        vm.resource = angular.copy(data);
        vm.referralNotes = AltumAPI.Referral.get({id: vm.resource.items.id, populate: 'notes'});

        // parse serviceDate dates and add serviceGroupByDate of just the day to use as group key
        vm.services = _.map(data.items.recommendedServices, function (service) {
          service.serviceGroupByDate = moment(service.serviceDate).startOf('day').format('dddd, MMMM Do YYYY');
          service.serviceDate = moment(service.serviceDate).format('MMM D, YYYY h:mm a');
          service.visitServiceName = (service.visitService) ? service.visitService.displayName : '-';
          return service;
        });

        // data columns for referral overview table
        vm.referralOverview = {
          'COMMON.MODELS.CLIENT.MRN': data.items.client_mrn,
          'COMMON.MODELS.REFERRAL.CLIENT': data.items.client_displayName,
          'COMMON.MODELS.REFERRAL.CLAIM_NUMBER': data.items.claimNumber,
          'COMMON.MODELS.REFERRAL.PROGRAM': data.items.program_name,
          'COMMON.MODELS.REFERRAL.PHYSICIAN': data.items.physician_name,
          'COMMON.MODELS.REFERRAL.STAFF': data.items.staff_name,
          'COMMON.MODELS.REFERRAL.SITE': data.items.site_name
        };

        // initialize submenu
        HeaderService.setSubmenu('referral', data.links);
      });
    }
  }

})();
