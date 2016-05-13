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
      'altum.referral.recommendationsPicker'
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
    vm.recommendedServices = [];
    vm.availableServices = [];

    // bindable methods
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
        vm.sharedService = {};
        vm.resource = angular.copy(data);
        vm.referral = angular.copy(data.items);
        vm.availableServices = angular.copy(data.items.availableServices);
        vm.referralNotes = angular.copy(data.items.notes);

        // load physician in from referraldetail
        vm.sharedService.physician = data.items.physician || null;
        vm.sharedService.staffCollection = {};
        vm.sharedService.staff = [];
        vm.sharedService.workStatus = null;
        vm.sharedService.prognosis = null;
        vm.sharedService.prognosisTimeframe = null;
        vm.sharedService.visitService = null;
        vm.sharedService.serviceDate = new Date();

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

        // load in staff selections from referraldetail
        if (data.items.staff) {
          vm.sharedService.staff = [data.items.staff];
          vm.sharedService.staffCollection[data.items.staffType_name] = [data.items.staff];
        }

        // initialize submenu
        HeaderService.setSubmenu('referral', data.links);
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
        windowClass: 'variations-modal-window',
        resolve: {
          displayMode: function () {
            return true;
          },
          Variation: function () {
            return vm.recommendedServices[vm.currIndex].serviceVariation;
          },
          Selection: function () {
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
          AltumAPI.AltumService.get({id: selection.service.value.altumService, populate: 'sites'}, function (altumService) {
            vm.recommendedServices[vm.currIndex].variationSelection.name = altumService.name;

            if (altumService.sites.length > 0) {
              vm.recommendedServices[vm.currIndex].availableSites = altumService.sites;
              vm.recommendedServices[vm.currIndex].siteDictionary = _.indexBy(altumService.sites, 'id');
            }
          });

          // store altum/program service to be applied on save
          vm.recommendedServices[vm.currIndex].variationSelection.altumService = selection.service.value.altumService;
          vm.recommendedServices[vm.currIndex].variationSelection.programService = selection.service.value.programService;
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

