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
      'dados.common.directives.focusIf'
    ])
    .controller('RecommendationsController', RecommendationsController);

  RecommendationsController.$inject = [
    '$q', '$resource', '$uibModal', '$location', 'API', 'HeaderService', 'AltumAPIService', 'toastr'
  ];

  function RecommendationsController($q, $resource, $uibModal, $location, API, HeaderService, AltumAPI, toastr) {
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

    vm.serviceOrder = {
      recommendedServices: 2,
      serviceDetail: 1
    };
    vm.accordionStatus = {};

    vm.staffCollection = {};
    vm.referralNotes = [];
    vm.recommendedServices = [];
    vm.availableServices = [];
    vm.availablePrognosis = AltumAPI.Prognosis.query();
    vm.availableTimeframes = AltumAPI.Timeframe.query();
    AltumAPI.StaffType.query({
      where: {isProvider: true}
    }).$promise.then(function (staffTypes) {
      vm.availableStaffTypes = _.map(staffTypes, function (staffType) {
        staffType.baseQuery = {staffType: staffType.id};
        return staffType;
      });
    });

    // bindable methods
    vm.isServiceRecommended = isServiceRecommended;
    vm.duplicateService = duplicateService;
    vm.toggleService = toggleService;
    vm.selectServiceDetail = selectServiceDetail;
    vm.setServiceSelections = setServiceSelections;
    vm.setStaffSelections = setStaffSelections;
    vm.navigateKey = navigateKey;
    vm.saveServices = saveServices;
    vm.isServiceValid = isServiceValid;
    vm.areServicesValid = areServicesValid;
    vm.swapPanelOrder = swapPanelOrder;
    vm.openVariationModal = openVariationModal;
    vm.openMap = openMap;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      Resource.get(function (data, headers) {
        vm.resource = angular.copy(data);
        vm.referral = angular.copy(data.items);
        vm.referralNotes = angular.copy(data.items.notes);
        vm.referralOverview = {
          'COMMON.MODELS.CLIENT.MRN': data.items.client_mrn,
          'COMMON.MODELS.REFERRAL.CLIENT': data.items.client_displayName,
          'COMMON.MODELS.REFERRAL.CLAIM_NUMBER': data.items.claimNumber,
          'COMMON.MODELS.REFERRAL.PROGRAM': data.items.program_name,
          'COMMON.MODELS.REFERRAL.PHYSICIAN': data.items.physician_name,
          'COMMON.MODELS.REFERRAL.STAFF': data.items.staff_name,
          'COMMON.MODELS.REFERRAL.SITE': data.items.site_name
        };

        // load physician in from referraldetail
        vm.physician = data.items.physician || null;
        vm.staffCollection = {};
        vm.staff = [];
        vm.workStatus = null;
        vm.prognosis = null;
        vm.prognosisTimeframe = null;
        vm.visitService = null;
        vm.serviceDate = new Date();

        // load in staff selections from referraldetail
        if (data.items.staff) {
          vm.staff = [vm.staff];
          vm.staffCollection[data.items.staffType_name] = [data.items.staff];
          setStaffSelections(data.items.staffType_name);
        }

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
        staff: vm.staff,
        workStatus: vm.workStatus,
        prognosis: vm.prognosis,
        prognosisTimeframe: vm.prognosisTimeframe,
        visitService: vm.visitService,
        serviceDate: vm.serviceDate
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
          serviceDate: new Date(),
          serviceVariation: altumProgramService.serviceVariation,
          site: null,
          approvalNeeded: altumProgramService.approvalNeeded,
          approvalRequired: altumProgramService.approvalRequired
        });
      });
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
     * duplicateService
     * @description Utility function for duplicating a service to set different variations for the same service.
     * @param service
     * @param index
     * @param event
     */
    function duplicateService(service, index, event) {
      if (event) {
        event.stopPropagation();
      }
      vm.recommendedServices.splice(index + 1, 0, angular.copy(service));
      vm.currIndex = vm.currIndex ? (vm.currIndex + 1) : index + 1;
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
        delete service.site;
        delete service.variationSelection;
        vm.recommendedServices = _.without(vm.recommendedServices, service);
      } else {
        vm.recommendedServices.push(_.merge(service, getSharedServices()));
        var toPopulate = ['sites', 'staffTypes'];
        if (service.serviceVariation) { // populate variations if applicable
          toPopulate.push('serviceVariation');
        }

        // upon recommending service, fetch additional info needed for visit panels like sites and staffTypes
        AltumAPI.AltumService.get({id: service.altumService, populate: toPopulate}, function (data) {
          if (data.serviceVariation) {
            _.last(vm.recommendedServices).serviceVariation = angular.copy(data.serviceVariation);
          }

          if (data.sites.length > 0) {
            _.last(vm.recommendedServices).availableSites = data.sites;
            _.last(vm.recommendedServices).siteDictionary = _.indexBy(data.sites, 'id');
          }

          if (data.staffTypes.length > 0) {
            _.last(vm.recommendedServices).staff = [];
            _.last(vm.recommendedServices).staffCollection = {};
            _.last(vm.recommendedServices).availableStaffTypes = _.map(data.staffTypes, function (staffType) {
              staffType.baseQuery = {staffType: staffType.id};
              return staffType;
            });
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
     * setStaffSelections
     * @description Sets service details for all dynamically built staff selections
     */
    function setStaffSelections(staffName) {
      // add any newly selected staff
      vm.staff = _.union(vm.staff, vm.staffCollection[staffName]);

      // no way of knowing if staff were unselected, so comb over with filter
      vm.staff = _.filter(vm.staff, function (staffID) {
        return _.contains(_.flatten(_.values(vm.staffCollection)), staffID);
      });
      setServiceSelections('staff');
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
      vm.isSaving = true;
      $q.all(_.map(vm.recommendedServices, function (service) {
          if (_.has(service, 'serviceVariation') && _.has(service, 'variationSelection')) {
            _.each(service.variationSelection.changes, function (value, key) {
              if (key === 'service') {
                service.altumService = service.variationSelection.altumService;
                service.programService = service.variationSelection.programService;
                service.name = service.variationSelection.name;
              } else {
                service[key + 'Detail'] = service.variationSelection.changes[key].value;
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
        .then(function(data) {
          toastr.success('Added services to referral for client: ' + vm.referral.client_displayName, 'Recommendations');
          vm.isSaving = false;
          vm.currIndex = null;
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

    /**
     * openVariationModal
     * @description Click handler for new/edit functionality for variations.  Will pass in
     *              an empty base variation if creating new.
     * @param canEdit
     */
    function openVariationModal(canEdit) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'servicevariation/variationModal.tpl.html',
        controller: 'VariationModalController',
        controllerAs: 'varmodal',
        bindToController: true,
        resolve: {
          displayMode: function() {
            return true;
          },
          Variation: function() {
            return vm.recommendedServices[vm.currIndex].serviceVariation;
          },
          Selection: function() {
            var variations = angular.copy(vm.recommendedServices[vm.currIndex].variationSelection);
            return variations ? variations.changes : null;
          }
        }
      });

      modalInstance.result.then(function (selection) {
        // store selected variations
        vm.recommendedServices[vm.currIndex].variationSelection = {
          changes: angular.copy(selection)
        };

        // if service was selected as a variation, update appropriate data
        if (_.has(selection, 'service')) {
          // rename service in recommended services tab
          AltumAPI.AltumService.get({id: selection.service.value.altumService}, function (altumService) {
            vm.recommendedServices[vm.currIndex].variationSelection.name = altumService.name;
          });

          // store altum/program service to be applied on save
          vm.recommendedServices[vm.currIndex].variationSelection.altumService = selection.service.value.altumService;
          vm.recommendedServices[vm.currIndex].variationSelection.programService = selection.service.value.programService;
        } else {
          delete vm.recommendedServices[vm.currIndex].variationSelection;
        }
      });
    }

    /**
     * openMap
     * @description opens a modal window for the mapModal site picker
     */
    function openMap() {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'map-modal-window',
        templateUrl: 'referral/triage/mapModal.tpl.html',
        controller: 'MapModalController',
        controllerAs: 'mapmodal',
        bindToController: true,
        size: 'lg',
        resolve: {
          selectedSite: function () {
            if (!_.isEmpty(vm.selectedSite)) {
              return AltumAPI.Site.get({
                id: rec.recommendedServices[rec.currIndex].site,
                populate: 'address'
              }).$promise;
            } else {
              return null;
            }
          },
          sites: function () {
            return AltumAPI.Site.query({
              where: {
                id: _.pluck(vm.recommendedServices[vm.currIndex].availableSites, 'id')
              }
            }).$promise;
          },
          referral: function () {
            return {
              title: vm.referral.client_displayName,
              addressID: vm.referral.client_address,
              addressName: _.values(_.pick(vm.referral, 'client_address1', 'client_address2', 'client_city', 'client_province', 'client_postalCode', 'client_country')).join(' '),
              latitude: vm.referral.client_latitude,
              longitude: vm.referral.client_longitude
            };
          }
        }
      });

      modalInstance.result.then(function (selectedSite) {
        vm.recommendedServices[vm.currIndex].site = angular.copy(selectedSite.id);
      });
    }

  }

})();

