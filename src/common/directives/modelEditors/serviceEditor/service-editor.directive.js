/**
 * @name service-editor
 * @description Angular component that abstracts the functionality for editing services
 * @example <service-editor service="service"></service-editor>
 */

(function() {
  'use strict';

  angular
    .module('dados.common.directives.serviceEditor', [
      'dados.common.directives.variationsEditor'
    ])
    .controller('ServiceEditorController', ServiceEditorController)
    .component('serviceEditor', {
      bindings: {
        service: '=',
        approvedServices: '='
      },
      templateUrl: 'directives/modelEditors/serviceEditor/service-editor.tpl.html',
      controller: 'ServiceEditorController',
      controllerAs: 'svc'
    });

  ServiceEditorController.$inject = ['AltumAPIService', '$uibModal', 'VARIATION_TYPES'];

  function ServiceEditorController(AltumAPI, $uibModal, VARIATION_TYPES) {
    var vm = this;

    // bindable variables
    vm.service = vm.service || {};
    vm.approvedServices = vm.approvedServices || [];

    vm.referral = vm.referral || {};
    vm.availableSites = [];
    vm.siteDictionary = _.indexBy(vm.availableSites, 'id');
    vm.availableWorkstatus = AltumAPI.WorkStatus.query();
    vm.availablePrognosis = AltumAPI.Prognosis.query();
    vm.availableTimeframes = AltumAPI.Timeframe.query();

    // set applicable variation types for a service
    vm.variationTypes = _.indexBy(_.reject(VARIATION_TYPES, function (type) {
      return _.contains(['none', 'menu'], type.type);
    }), 'type');

    AltumAPI.StaffType.query({
      where: {isProvider: true}
    }).$promise.then(function (staffTypes) {
      vm.availableStaffTypes = _.map(staffTypes, function (staffType) {
        staffType.baseQuery = {staffType: staffType.id};
        return staffType;
      });
    });

    // bindable methods
    vm.fetchAltumServiceData = fetchAltumServiceData;
    vm.hasTimeframe = hasTimeframe;
    vm.openMap = openMap;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      // set visitService to just ID
      if (_.has(vm.service.visitService, 'id')) {
        vm.service.visitService = vm.service.visitService.id;
      }

      // populate service variations if applicable
      if (!_.isNull(vm.service.altumService)) {
        fetchAltumServiceData();
      }

      // fetch referral data
      if (!_.has(vm.service.referral, 'id')) {
        vm.referral = AltumAPI.Referral.get({id: vm.service.referral});
      }
    }

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
  }

})();
