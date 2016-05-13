/**
 * @name recommendations-picker
 * @description Abstracted component for picking services for recommendations
 * @example
 *    <recommendations-picker ng-if="rec.referral"
 *                            referral="rec.referral"
 *                            service="rec.sharedService"
 *                            curr-index="rec.currIndex"
 *                            available-services="rec.availableServices"
 *                            recommended-services="rec.recommendedServices"
 *                            search-query="rec.search">
 *    </recommendations-picker>
 *
 */
(function() {
  angular
    .module('altum.referral.recommendationsPicker', [
      'ui.bootstrap',
      'ngMaterial',
      'ngResource',
      'toastr',
      'dados.common.services.altum',
      'dados.common.directives.focusIf'
    ])
    .component('recommendationsPicker', {
      bindings: {
        referral: '=',            // bound referral containing client information
        service: '=',             // shared service object
        currIndex: '=',           // current selected index in recommendedServices array
        availableServices: '=',   // array of available services to pick from
        recommendedServices: '=', // array of selected services to recommend
        searchQuery: '='          // string bound for fuzzy searching available services
      },
      controller: 'RecommendationsPickerController',
      controllerAs: 'recPicker',
      templateUrl: 'referral/directives/recommendations-picker/recommendations-picker.tpl.html'
    })
    .controller('RecommendationsPickerController', RecommendationsPickerController);

  RecommendationsPickerController.$inject = ['$scope', 'AltumAPIService'];

  function RecommendationsPickerController($scope, AltumAPI) {
    var vm = this;

    // bindable variables
    vm.referral = vm.referral || {};
    vm.service = vm.service || {};
    vm.currIndex = vm.currIndex || null;
    vm.availableServices = vm.availableServices || [];
    vm.recommendedServices = vm.recommendedServices || [];
    vm.searchQuery = vm.searchQuery || '';
    vm.accordionStatus = {};

    // bindable methods
    vm.isServiceRecommended = isServiceRecommended;
    vm.duplicateService = duplicateService;
    vm.toggleService = toggleService;
    vm.selectServiceDetail = selectServiceDetail;
    vm.navigateKey = navigateKey;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      if (vm.referral.program && vm.availableServices.length) {
        parseAvailableServices();
      }
    }

    /**
     * getSharedServices
     * @description Returns shared service data for all prospective recommended services
     * @returns {Object}
     */
    function getSharedServices() {
      return {
        physician: vm.service.physician,
        staff: vm.service.staff,
        staffCollection: vm.service.staffCollection,
        workStatus: vm.service.workStatus,
        prognosis: vm.service.prognosis,
        prognosisTimeframe: vm.service.prognosisTimeframe,
        visitService: vm.service.visitService,
        serviceDate: vm.service.serviceDate
      };
    }

    /**
     * parseAvailableServices
     * @description Fetches the available list of services to an empty set of the referral's programs's available services
     */
    function parseAvailableServices() {
      vm.recommendedServices = [];
      // available services denote all program services across each retrieved altum service
      // sorting respective program services by serviceCateogry takes place in the html template
      vm.availableServices = _.map(vm.availableServices, function (altumProgramService) {
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
          hasTelemedicine: altumProgramService.hasTelemedicine,
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
     * resetRecommendations
     * @description Re-initializes directive data whenever recommendations are made
     */
    function resetRecommendations(oldVal, newVal) {
      if (oldVal !== newVal) {
        init();
      }
    }
    $scope.$watch('recPicker.referral', resetRecommendations, true);
  }

})();
