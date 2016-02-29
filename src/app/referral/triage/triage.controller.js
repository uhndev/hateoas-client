/**
 * Controller for handling triage
 */
(function () {
  'use strict';

  angular
    .module('altum.triage.controller', [
      'dados.common.directives.selectLoader',
      'altum.triage.mapModal.controller'
    ])
    .controller('TriageController', TriageController);

  TriageController.$inject = ['$resource', 'API', 'HeaderService', 'AltumAPIService', '$location', '$uibModal', 'toastr'];

  function TriageController($resource,  API, HeaderService, AltumAPI, $location, $uibModal, toastr) {
    var vm = this;

    // bindable variables
    vm.url = API.url() + $location.path();
    vm.referralID = _.getParentIDFromUrl($location.path());
    vm.referral = {};
    vm.selectedProgram = {};
    vm.selectedPhysician = {};
    vm.selectedSite = {};
    vm.mapDisabled = true;

    // bindable methods
    vm.openMap = openMap;
    vm.save = save;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Resource = $resource(vm.url);

      Resource.get(function (data, headers) {
        vm.resource = data;
        vm.referral = data.items;
        vm.selectedPhysician = data.items.physician || {};
        vm.selectedSite = data.items.site || {};
        vm.selectedProgram = data.items.program || {};
        vm.mapDisabled = false;

        // initialize submenu
        HeaderService.setSubmenu('referral', data.links);
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
        resolve: {
          sites: function () {
            return AltumAPI.Site.query().$promise;
          },
          referral: function () {
            return vm.referral;
          }
        }
      });

      modalInstance.result.then(function (selectedSite) {
        vm.selectedSite = selectedSite;
      });
    }

    /**
     * save
     * @description save handler for the triage form
     */
    function save() {
      var newReferral = new AltumAPI.Referral();

      //set values from triage form
      newReferral.site = vm.selectedSite;
      newReferral.physician = vm.selectedPhysician;
      newReferral.program = vm.selectedProgram;
      newReferral.id = vm.referralID;

      //update referral
      newReferral.$update({id:vm.referralID}).then(function(resp) {
        toastr.success('Updated referral for client ' + vm.referral.clientcontact.displayName + '!');
      },
      function(err) {
        toastr.error('Updating referral ' + vm.referralID + 'failed. ' + err);
      });
    }
  }
})();
