(function () {
  'use strict';

  angular
    .module('altum.referral.services', [
      'ngMaterial',
      'ngResource',
      'toastr',
      'dados.header.service',
      'dados.common.services.altum'
    ])
    .controller('ServicesController', ServicesController);

  ServicesController.$inject = [
    '$resource', '$location', 'API', 'HeaderService', 'AltumAPIService', 'toastr'
  ];

  function ServicesController($resource, $location, API, HeaderService, AltumAPI, toastr) {
    var vm = this;
    vm.DEFAULT_GROUP_BY = 'serviceGroupByDate';
    vm.DEFAULT_SUBGROUP_BY = 'physician_displayName';

    // bindable variables
    vm.url = API.url() + $location.path();
    vm.groupBy = vm.DEFAULT_GROUP_BY;
    vm.subGroupBy = vm.DEFAULT_SUBGROUP_BY;

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

    // data columns for subgroups (encounters) under visits
    vm.subGroupFields = [
      {
        name: 'physician_displayName',
        prompt: 'COMMON.MODELS.SERVICE.PHYSICIAN'
      },
      {
        name: 'clinician_displayName',
        prompt: 'COMMON.MODELS.SERVICE.CLINICIAN'
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
        name: 'clinician_displayName',
        prompt: 'COMMON.MODELS.SERVICE.CLINICIAN'
      },
      {
        name: 'serviceDate',
        prompt: 'COMMON.MODELS.SERVICE.SERVICE_DATE'
      },
      {
        name: 'serviceType',
        prompt: 'COMMON.MODELS.SERVICE.SERVICE_TYPE'
      }
    ];

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Resource = $resource(vm.url);

      Resource.get(function (data, headers) {
        vm.resource = angular.copy(data);
        // parse serviceDate dates and add serviceGroupByDate of just the day to use as group key
        vm.services = _.map(data.items.recommendedServices, function (service) {
          service.serviceGroupByDate = moment(service.serviceDate).startOf('day').format('dddd, MMMM Do YYYY');
          service.serviceDate = moment(service.serviceDate).format('dddd, MMMM Do YYYY h:mm a');
          return service;
        });

        // data columns for referral overview table
        vm.referralOverview = {
          'COMMON.MODELS.CLIENT.MRN': data.items.client_mrn,
          'COMMON.MODELS.REFERRAL.CLIENT': data.items.client_displayName,
          'COMMON.MODELS.REFERRAL.CLAIM_NUMBER': data.items.claim_claimNum,
          'COMMON.MODELS.REFERRAL.PROGRAM': data.items.program_name,
          'COMMON.MODELS.REFERRAL.PHYSICIAN': data.items.physician_name,
          'COMMON.MODELS.REFERRAL.CLINICIAN': data.items.clinician_name,
          'COMMON.MODELS.REFERRAL.SITE': data.items.site_name
        };

        // initialize submenu
        HeaderService.setSubmenu('referral', data.links);
      });
    }
  }

})();
