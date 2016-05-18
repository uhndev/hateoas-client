(function () {
  'use strict';

  angular
    .module('altum.referral.recommendations', [
      'ui.bootstrap',
      'ngMaterial',
      'ngResource',
      'toastr',
      'dados.header.service',
      'dados.common.services.altum',
      'dados.common.directives.focusIf',
      'altum.referral.recommendationsPicker',
      'altum.referral.serviceDetail'
    ])
    .controller('RecommendationsController', RecommendationsController);

  RecommendationsController.$inject = [
    '$q', '$resource', '$location', 'API', 'HeaderService', 'toastr', 'RecommendationsService'
  ];

  function RecommendationsController($q, $resource, $location, API, HeaderService, toastr, RecommendationsService) {
    var vm = this;
    var ReferralServices;

    // bindable variables
    vm.url = API.url() + $location.path();
    var Resource = $resource(vm.url);
    var baseReferralUrl = _.pathnameToArray($location.path()).slice(0, -1).join('/');
    ReferralServices = $resource([API.url(), baseReferralUrl, 'services'].join('/'));

    // fields that are required in order to make recommendations
    vm.validityFields = ['visitService', 'serviceDate'];

    // fields that are used during configuration of recommended services that will be deleted before POSTing
    vm.configFields = [
      'availableSites', 'availableStaffTypes', 'siteDictionary',
      'staffCollection', 'serviceVariation', 'variationSelection'
    ];

    // configuration object for the service-editor component
    vm.serviceEditorConfig = {
      disabled: {
        altumService: true,
        programService: true,
        site: true
      },
      required: {
        visitService: true,
        serviceDate: true
      }
    };

    vm.serviceOrder = {
      recommendedServices: 2,
      serviceDetail: 1
    };
    vm.accordionStatus = {};
    vm.sharedService = {};
    vm.referralNotes = [];
    vm.currIndex = null;
    vm.recommendedServices = [];
    vm.availableServices = [];

    // bindable methods
    vm.saveServices = saveServices;
    vm.isServiceValid = isServiceValid;
    vm.areServicesValid = areServicesValid;
    vm.swapPanelOrder = swapPanelOrder;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      Resource.get(function (data, headers) {
        vm.sharedService = {};
        vm.resource = angular.copy(data);
        vm.referral = angular.copy(data.items);
        vm.availableServices = angular.copy(data.items.availableServices);
        vm.referralNotes = angular.copy(data.items.notes);

        // load physician in from referraldetail
        vm.sharedService = {
          physician: data.items.physician || null,
          staffCollection: {},
          staff: [],
          workStatus: null,
          prognosis: null,
          prognosisTimeframe: null,
          visitService: null,
          serviceDate: new Date()
        };

        // email fields for sending email from note directive
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

        // load in staff selections from referraldetail
        if (data.items.staff) {
          vm.sharedService.staff = [data.items.staff];
          vm.sharedService.staffCollection[data.items.staffType_name] = [data.items.staff];
        }

        // initialize submenu
        HeaderService.setSubmenu('referral', data.links);

        if (vm.referral.program) {
          vm.recommendedServices = [];
          vm.availableServices = RecommendationsService.parseAvailableServices(vm.sharedService, data.items.availableServices);
        }
      });
    }

    /**
     * saveServices
     * @description Saves the currently selected services to the current referral
     */
    function saveServices() {
      vm.isSaving = true;
      $q.all(_.map(vm.recommendedServices, function (service) {
          // for recommended services that have variations selected, apply to object to be sent to server
          if (_.has(service, 'serviceVariation') && _.has(service, 'variationSelection')) {
            _.each(service.variationSelection.changes, function (value, key) {
              switch (key) {
                case 'service':
                  service.altumService = service.variationSelection.altumService;
                  service.programService = service.variationSelection.programService;
                  service.name = service.variationSelection.name;
                  break;
                case 'followup':
                  service.followupPhysicianDetail = service.variationSelection.changes[key].value.physician;
                  service.followupTimeframeDetail = service.variationSelection.changes[key].value.timeframe;
                  break;
                default:
                  // otherwise, variation is of type number/text/date/physician/staff/timeframe/measure
                  // where the respective backend column name will be <type>DetailName and value will be <type>Detail
                  service[key + 'DetailName'] = service.variationSelection.changes[key].name;
                  service[key + 'Detail'] = service.variationSelection.changes[key].value;
                  break;
              }
            });
          }

          // clear config data before POSTing
          _.each(vm.configFields, function (field) {
            delete service[field];
          });

          var serviceObj = new ReferralServices(service);
          return serviceObj.$save();
        }))
        .then(function (data) {
          toastr.success('Added services to referral for client: ' + vm.referral.client_displayName, 'Recommendations');
          vm.isSaving = false;
          vm.currIndex = null;
          vm.recommendedServices = [];
          init();
        });
    }

    /**
     * isServiceValid
     * @description Checks if service have the correct prerequisite data before saving
     * @return {Boolean}
     */
    function isServiceValid(service) {
      // for all required fields (see top), return true if each recommended service has non-null field
      return _.all(vm.validityFields, function (field) {
        var isValid = _.has(service, field) && !_.isNull(service[field]);
        // if particular service requires a site selection, ensure it is not null
        if (_.has(service, 'availableSites') && service.availableSites.length) {
          return isValid && !_.isNull(service.site);
        }
        return isValid;
      });
    }

    /**
     * areServicesValid
     * @description Checks if all proposed recommended services have the correct prerequisite data before saving
     * @return {Boolean}
     */
    function areServicesValid() {
      return _.all(vm.recommendedServices, function (recommendedService) {
        return isServiceValid(recommendedService);
      });
    }

    /**
     * swapPanelOrder
     * @description Convenience method for switching order of service panels in the recommended services tab
     */
    function swapPanelOrder() {
      vm.serviceOrder.recommendedServices = vm.serviceOrder.recommendedServices ^ vm.serviceOrder.serviceDetail;
      vm.serviceOrder.serviceDetail = vm.serviceOrder.recommendedServices ^ vm.serviceOrder.serviceDetail;
      vm.serviceOrder.recommendedServices = vm.serviceOrder.recommendedServices ^ vm.serviceOrder.serviceDetail;
    }

  }

})();

