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
    .controller('ServicesController', ServicesController);

  ServicesController.$inject = [
    '$resource', '$location', 'API', 'HeaderService', 'AltumAPIService', 'RecommendationsService'
  ];

  function ServicesController($resource, $location, API, HeaderService, AltumAPI, RecommendationsService) {
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
        prompt: 'APP.REFERRAL.SERVICES.LABELS.ALTUM_SERVICE'
      },
      {
        name: 'physician_displayName',
        prompt: 'APP.REFERRAL.SERVICES.LABELS.PHYSICIAN'
      },
      {
        name: 'siteName',
        prompt: 'APP.REFERRAL.SERVICES.LABELS.SITE'
      },
      {
        name: 'visitServiceName',
        prompt: 'APP.REFERRAL.SERVICES.LABELS.VISIT_SERVICE'
      },
      {
        name: 'serviceDate',
        prompt: 'APP.REFERRAL.SERVICES.LABELS.SERVICE_DATE'
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
      }
    ];

    vm.init = init;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
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
        vm.referralNotes = AltumAPI.Referral.get({id: vm.referral.id, populate: 'notes'});

        // parse serviceDate dates and add serviceGroupByDate of just the day to use as group key
        vm.services = _.map(data.items.recommendedServices, function (service) {
          service.serviceGroupByDate = moment(service.serviceDate).startOf('day').format('dddd, MMMM Do YYYY');
          service.serviceDate = moment(service.serviceDate).format('MMM D, YYYY h:mm a');
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
