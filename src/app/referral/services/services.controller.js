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
      'altum.referral.serviceGroup'
    ])
    .constant('REFERRAL_SERVICE_VISIT_FIELDS', [
      'altumServiceName', 'physician_displayName', 'siteName', 'serviceDate', 'visitServiceName', 'approval', 'completion'
    ])
    .controller('ServicesController', ServicesController);

  ServicesController.$inject = [
    '$resource', '$location', 'API', 'HeaderService', 'AltumAPIService',
    'RecommendationsService', 'REFERRAL_SERVICE_VISIT_FIELDS'
  ];

  function ServicesController($resource, $location, API, HeaderService, AltumAPI,
                              RecommendationsService, REFERRAL_SERVICE_VISIT_FIELDS) {
    var vm = this;

    var templateFilterFields = [
      'programServiceName', 'programName', 'payorName', 'workStatusName', 'prognosisName',
      'prognosisTimeframeName', 'billingGroupName', 'billingGroupItemLabel', 'itemCount',
      'totalItems', 'approvalDate', 'statusName', 'completionStatusName', 'billingStatusName', 'physicianDisplayName'
    ];

    vm.DEFAULT_GROUP_BY = 'statusName';
    vm.DEFAULT_SUBGROUP_BY = 'siteName';

    // bindable variables
    vm.url = API.url() + $location.path();
    vm.referralNotes = [];
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
        name: 'altumServiceName',
        prompt: 'COMMON.MODELS.SERVICE.ALTUM_SERVICE'
      },
      {
        name: 'physician_displayName',
        prompt: 'COMMON.MODELS.SERVICE.PHYSICIAN'
      },
      {
        name: 'serviceGroupByDate',
        prompt: 'COMMON.MODELS.SERVICE.SERVICE_DATE'
      }
    ];

    // data columns for groups (visits)
    vm.visitFields = [];

    vm.init = init;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init(templateFields, visitFields) {
      var Resource = $resource(vm.url);

      Resource.get(function (data, headers) {
        vm.referral = angular.copy(data.items);

        //email fields for sending email from note directive
        vm.emailInfo = {
          template: 'referral',
          data: {
            claim: vm.referral.claimNumber,
            client: vm.referral.client_displayName
          },
          options: {
            subject:  'Altum CMS Communication for' + ' ' + vm.referral.client_displayName
          }
        };

        // setup array of fields to choose from for referral services
        vm.templateFieldOptions = _.filter(data.template.data, function (field) {
          return _.contains(templateFilterFields, field.name);
        });

        // setup array of fields to choose from for referral billing
        vm.billingFieldOptions = _.reject(vm.templateFieldOptions, function (field) {
          return _.contains(['billingCount'], field.name);
        });

        // configure visit fields for referral services subgroup tables and add statuses
        vm.visitFields = _.filter(data.template.data.concat([
          {
            name: 'approval',
            prompt: 'COMMON.MODELS.SERVICE.APPROVALS',
            type: 'status'
          },
          {
            name: 'completion',
            prompt: 'COMMON.MODELS.SERVICE.COMPLETION',
            type: 'status'
          }
        ]), function (field) {
          return _.contains(REFERRAL_SERVICE_VISIT_FIELDS, field.name);
        });

        vm.referralNotes = AltumAPI.Referral.get({id: vm.referral.id, populate: 'notes'});

        // parse serviceDate dates and add serviceGroupByDate of just the day to use as group key
        vm.services = _.map(data.items.recommendedServices, function (service) {
          service.serviceGroupByDate = moment(service.serviceDate).startOf('day').format('dddd, MMMM Do YYYY');
          service.serviceDate = moment(service.serviceDate).format('MMM D, YYYY h:mm a');
          service.visitServiceName = (service.visitService) ? service.visitService.displayName : '-';
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
  }

})();
