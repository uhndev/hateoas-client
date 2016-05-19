/**
 * @name service-editor
 * @description Angular component that abstracts the functionality for editing services
 * @example <service-editor ng-if="rec.referral"
                            referral="rec.referral"
                            service="rec.sharedService"
                            approved-services="rec.referral.approvedServices"
                            recommended-services="rec.recommendedServices"></service-editor>
 */

(function() {
  'use strict';

  angular
    .module('dados.common.directives.serviceEditor', [
      'dados.common.directives.variationsEditor',
      'dados.common.services.template'
    ])
    .constant('SERVICE_FIELDS', [
      'altumService', 'programService', 'site', 'physician', 'staff',
      'workStatus', 'prognosis', 'prognosisTimeframe', 'visitService', 'serviceDate'
    ])
    .controller('ServiceEditorController', ServiceEditorController)
    .component('serviceEditor', {
      bindings: {
        horizontal: '@?',           // boolean for whether or not we want horizontal form
        referral: '=?',             // optionally passed in referral object containing client info
        service: '=',               // required service object to edit
        configuration: '<?',        // optional configuration object denoting which fields are disabled/required
        isValid: '=',               // boolean flag denoting whether or not serviceForm is valid
        recommendedServices: '=?',  // two-way bound array of recommended services to manage
        approvedServices: '='       // two-way bound array of available visit services
      },
      templateUrl: 'directives/modelEditors/serviceEditor/service-editor.tpl.html',
      controller: 'ServiceEditorController',
      controllerAs: 'svc'
    });

  ServiceEditorController.$inject = ['$scope', 'AltumAPIService', '$uibModal', 'SERVICE_FIELDS'];

  function ServiceEditorController($scope, AltumAPI, $uibModal, SERVICE_FIELDS) {
    var vm = this;
    var defaultConfig = {disabled: {}, required: {}};
    _.each(SERVICE_FIELDS, function (field) {
      defaultConfig.disabled[field] = false;
      defaultConfig.required[field] = false;
    });

    // bindable variables
    vm.horizontal = vm.horizontal == 'true' || false;
    vm.referral = vm.referral || {};
    vm.service = vm.service || {};
    vm.configuration = vm.configuration || defaultConfig;
    vm.recommendedServices = vm.recommendedServices || [];
    vm.approvedServices = vm.approvedServices || [];

    // bindable methods
    vm.fetchAltumServiceData = fetchAltumServiceData;
    vm.setServiceSelections = setServiceSelections;
    vm.setStaffSelections = setStaffSelections;
    vm.hasTimeframe = hasTimeframe;
    vm.openMap = openMap;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      // merge in default settings
      vm.configuration = {
        disabled: _.merge(defaultConfig.disabled, vm.configuration.disabled),
        required: _.merge(defaultConfig.required, vm.configuration.required)
      };

      // remove fields from object if they have been chosen as disabled
      _.each(SERVICE_FIELDS, function (field) {
        if (vm.configuration.disabled[field]) {
          delete vm.service[field];
        }
      });

      // configure objects accordingly based on what was chosen to be disabled
      if (!vm.configuration.disabled.site) {
        vm.availableSites = [];
        vm.siteDictionary = _.indexBy(vm.availableSites, 'id');
      }

      if (!vm.configuration.disabled.workStatus) {
        vm.availableWorkstatus = AltumAPI.WorkStatus.query();
      }

      if (!vm.configuration.disabled.prognosis) {
        vm.availablePrognosis = AltumAPI.Prognosis.query();
      }

      if (!vm.configuration.disabled.prognosisTimeframe) {
        vm.availableTimeframes = AltumAPI.Timeframe.query();
      }

      if (!vm.configuration.disabled.staff) {
        vm.service.staffCollection = {};
        AltumAPI.StaffType.query({
          where: {isProvider: true}
        }).$promise.then(function (staffTypes) {
          vm.availableStaffTypes = _.map(staffTypes, function (staffType) {
            staffType.baseQuery = {staffType: staffType.id};
            return staffType;
          });
        });
      }

      // set visitService with additional detail from servicedetail
      if (vm.service.visitService && !vm.configuration.disabled.visitService) {
        vm.service.visitService = _.find(vm.approvedServices, {id: vm.service.visitService.id});
      }

      // populate service variations if applicable
      if (!_.isNull(vm.service.altumService) && !vm.configuration.disabled.altumService) {
        fetchAltumServiceData();
      }

      // fetch referral data if not passed in
      if (_.isNumber(vm.referral) && !_.has(vm.referral, 'id')) {
        vm.referral = AltumAPI.Referral.get({id: vm.referral});
      }

      // parse service date
      if (angular.isString(vm.service.serviceDate)) {
        vm.service.serviceDate = new Date(vm.service.serviceDate);
      }

      // sort staff into respective collections
      _.each(vm.service.staff, function (staff) {
        if (!_.isArray(vm.service.staffCollection[staff.staffTypeDisplayName])) {
          vm.service.staffCollection[staff.staffTypeDisplayName] = [];
        }
        vm.service.staffCollection[staff.staffTypeDisplayName].push(staff);
      });
    }

    /**
     * fetchAltumServiceData
     * @description Fetches additional data required for services to be fully editable
     */
    function fetchAltumServiceData() {
      vm.service.altumService = AltumAPI.AltumService.get({
        id: vm.service.altumService,
        populate: ['serviceVariation', 'sites']
      }, function (altumService) {
        if (altumService.sites.length > 0) {
          vm.availableSites = altumService.sites;
          vm.siteDictionary = _.indexBy(altumService.sites, 'id');
        }
      });
    }

    /**
     * setServiceSelections
     * @description Sets shared service details for all currently recommended services
     */
    function setServiceSelections(attribute) {
      vm.recommendedServices = _.map(vm.recommendedServices, function (recommendedService) {
        recommendedService[attribute] = vm.service[attribute];
        return recommendedService;
      });
    }

    /**
     * setStaffSelections
     * @description Sets service details for all dynamically built staff selections
     */
    function setStaffSelections(staffName) {
      // add any newly selected staff
      vm.service.staff = _.union(vm.service.staff, vm.service.staffCollection[staffName]);

      // no way of knowing if staff were unselected, so comb over with filter
      vm.service.staff = _.filter(vm.service.staff, function (staffID) {
        return _.contains(_.flatten(_.values(vm.service.staffCollection)), staffID);
      });
      setServiceSelections('staff');
    }

    /**
     * hasTimeframe
     * @description Convenience function for determining if a prognosis has a timeframe
     * @returns {Boolean}
     */
    function hasTimeframe() {
      var prognosis = _.find(vm.availablePrognosis, {id: vm.service.prognosis});
      return prognosis ? prognosis.hasTimeframe : false;
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
            return AltumAPI.Site.get({
              id: vm.service.site,
              populate: 'address'
            }).$promise;
          },
          sites: function () {
            return AltumAPI.Site.query({
              where: {
                id: _.pluck(vm.availableSites, 'id')
              }
            }).$promise;
          },
          referral: function () {
            return {
              title: vm.referral.clientcontact.displayName,
              addressID: vm.referral.clientcontact.address,
              addressName: _.values(_.pick(vm.referral.clientcontact, 'address1', 'address2', 'city', 'province', 'postalCode', 'country')).join(' '),
              latitude: vm.referral.clientcontact.latitude,
              longitude: vm.referral.clientcontact.longitude
            };
          }
        }
      });

      modalInstance.result.then(function (selectedSite) {
        vm.service.site = angular.copy(selectedSite.id);
      });
    }

    /**
     * watchFormValidity
     * @description Sets up a watch expression on the ng-form validity flags and passes through
     *              value to the bound isValid variable in the service-editor directive.
     */
    function watchFormValidity(newVal, oldVal) {
      vm.isValid = newVal;
    }
    $scope.$watch('svc.serviceForm.$valid', watchFormValidity);
  }

})();
