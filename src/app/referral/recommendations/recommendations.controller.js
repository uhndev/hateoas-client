(function () {
  'use strict';

  angular
    .module('altum.referral.recommendations', [
      'ngMaterial',
      'ngResource',
      'toastr',
      'dados.header.service',
      'dados.common.services.altum',
      'dados.common.directives.focusIf'
    ])
    .controller('RecommendationsController', RecommendationsController);

  RecommendationsController.$inject = [
    '$q', '$resource', '$location', 'API', 'HeaderService', 'AltumAPIService', 'toastr'
  ];

  function RecommendationsController($q, $resource, $location, API, HeaderService, AltumAPI, toastr) {
    var vm = this;
    var ReferralServices;

    // bindable variables
    vm.url = API.url() + $location.path();

    vm.physician = null;
    vm.clinician = null;
    vm.workStatus = null;
    vm.prognosis = null;
    vm.prognosisTimeframe = null;
    vm.serviceType = null;
    vm.approvalNeeded = null;
    vm.serviceDate = new Date();
    vm.currentDate = new Date();
    vm.validityFields = ['physician', 'clinician', 'workStatus', 'prognosis', 'serviceType', 'serviceDate'];
    vm.serviceOrder = {
      recommendedServices: 1,
      serviceDetail: 2
    };

    vm.recommendedServices = [];
    vm.availableServices = [];

    // bindable methods
    vm.fetchLoaderData = fetchLoaderData;
    vm.isServiceRecommended = isServiceRecommended;
    vm.toggleService = toggleService;
    vm.selectServiceDetail = selectServiceDetail;
    vm.setServiceSelections = setServiceSelections;
    vm.navigateKey = navigateKey;
    vm.saveServices = saveServices;
    vm.isServiceValid = isServiceValid;
    vm.areServicesValid = areServicesValid;
    vm.swapPanelOrder = swapPanelOrder;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Resource = $resource(vm.url);
      var baseReferralUrl = _.pathnameToArray($location.path()).slice(0, -1).join('/');
      ReferralServices = $resource([API.url(), baseReferralUrl, 'services'].join('/'));

      Resource.get(function (data, headers) {
        vm.resource = angular.copy(data);
        vm.referral = angular.copy(data.items);
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

        if (vm.referral.program) {
          fetchAvailableServices(data.items.availableServices);
        }
      });
    }

    /**
     * getSharedServices
     * @description Returns shared service data for all prospective recommended services
     * @returns {Object}
     */
    function getSharedServices() {
      return {
        physician: vm.physician,
        clinician: vm.clinician,
        workStatus: vm.workStatus,
        prognosis: vm.prognosis,
        prognosisTimeframe: vm.prognosisTimeframe,
        serviceType: vm.serviceType,
        serviceDate: vm.currentDate
      };
    }

    /**
     * fetchAvailableServices
     * @description Fetches the available list of services to an empty set of the referral's programs's available services
     */
    function fetchAvailableServices(altumProgramServices) {
      vm.recommendedServices = [];

      // available services denote all program services across each retrieved altum service
      // sorting respective program services by serviceCateogry takes place in the html template
      vm.availableServices = _.map(altumProgramServices, function (altumProgramService) {
        // append each altumProgramService's altumProgramServices to the list of available prospective services
        return _.merge(getSharedServices(), {
          name: altumProgramService.altumServiceName,
          altumService: altumProgramService.id,
          programService: altumProgramService.programService,
          serviceCategory: altumProgramService.serviceCategory,
          serviceCategoryName: altumProgramService.serviceCategoryName,
          site: null,
          approvalNeeded: altumProgramService.approvalRequired
        });
      });
    }

    /**
     * fetchLoaderData
     * @description Fetches data from dropdowns on visit info panel once some services have been selected
     */
    function fetchLoaderData() {
      if (!vm.availablePrognosis || !vm.availableTimeframes || !vm.availableServiceTypes) {
        vm.availablePrognosis = AltumAPI.Prognosis.query();
        vm.availableTimeframes = AltumAPI.Timeframe.query();
        AltumAPI.ServiceType.query().$promise.then(function (serviceTypes) {
          vm.availableServiceTypes = _.groupBy(serviceTypes, 'category');
        });
      }
    }

    /**
     * isServiceRecommended
     * @description Returns bool reporting if service is recommended
     * @param {String} service
     */
    function isServiceRecommended(service) {
      return _.contains(vm.recommendedServices, service);
    }

    /**
     * toggleService
     * @description Adds/removes a programService from recommendedServices
     * @param {String} service
     */
    function toggleService(service, event) {
      if (event) {
        event.stopPropagation();
      }
      if (isServiceRecommended(service)) {
        service.site = null;
        vm.recommendedServices = _.without(vm.recommendedServices, service);
      } else {
        vm.recommendedServices.push(_.merge(service, getSharedServices()));

        AltumAPI.AltumService.get({id: service.altumService, populate: 'sites'}, function (data) {
          if (data.sites.length > 0) {
            _.last(vm.recommendedServices).availableSites = data.sites;
            _.last(vm.recommendedServices).siteDictionary = _.indexBy(data.sites, 'id');
          }
        });
      }
    }

    /**
     * selectServiceDetail
     * @description Selects a recommended service for detail editing
     * @param {Number} $index
     */
    function selectServiceDetail($index) {
      vm.currIndex = (vm.currIndex === $index ? null : $index);
    }

    /**
     * setServiceSelections
     * @description Sets shared service details for all currently recommended services
     */
    function setServiceSelections(attribute) {
      vm.recommendedServices = _.map(vm.recommendedServices, function (recommendedService) {
        recommendedService[attribute] = vm[attribute];
        return recommendedService;
      });
    }

    /**
     * navigateKey
     * @description Allows user to navigate selected recommended services via arrow keys
     * @param $event
     */
    function navigateKey($event, $index) {
      $event.preventDefault();
      $event.stopPropagation();
      switch ($event.keyCode) {
        case 37: // left
          if (!_.isNull(vm.currIndex)) {
            vm.currIndex = null;
          }
          break;
        case 38: // up
          if (!_.isNull(vm.currIndex) && vm.currIndex > 0) {
            vm.currIndex--;
          } else {
            vm.currIndex = vm.recommendedServices.length - 1;
          }
          break;
        case 39: // right
          if (_.isNull(vm.currIndex)) {
            vm.currIndex = $index;
          }
          break;
        case 40: // down
          if (!_.isNull(vm.currIndex) && vm.currIndex < vm.recommendedServices.length - 1) {
            vm.currIndex++;
          } else {
            vm.currIndex = 0;
          }
          break;
      }
    }

    /**
     * saveServices
     * @description Saves the currently selected services to the current referral
     */
    function saveServices() {
      $q.all(_.map(vm.recommendedServices, function (service) {
          var serviceObj = new ReferralServices(service);
          return serviceObj.$save();
        }))
        .then(function(data) {
          toastr.success('Added services to referral for client: ' + vm.referral.client_displayName, 'Recommendations');
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

