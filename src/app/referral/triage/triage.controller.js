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

  function TriageController($resource, API, HeaderService, AltumAPI, $location, $uibModal, toastr) {
    var vm = this;

    // bindable variables
    vm.url = API.url() + $location.path();
    vm.referralID = _.getParentIDFromUrl($location.path());
    vm.staffTypes = AltumAPI.StaffType.query({
      where: {
        isProvider: true
      }
    });
    vm.selectedProgram = null;
    vm.selectedPhysician = null;
    vm.selectedStaff = null;
    vm.selectedSite = null;
    vm.mapDisabled = true;

    // bindable methods
    vm.checkPrimaryProviders = checkPrimaryProviders;
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
        vm.selectedStaff = data.items.staff || {};
        vm.selectedSite = data.items.site || {};
        vm.selectedProgram = data.items.program || {};
        vm.isPhysicianPrimary = data.items.isPhysicianPrimary;
        vm.isStaffPrimary = !data.items.isPhysicianPrimary;
        vm.mapDisabled = false;

        //email fields for sending email from note directive
        vm.emailInfo = {
          template: 'referral',
          data: {
            claim: vm.referral.claimNumber,
            client: vm.referral.client_displayName,
            url: encodeURI(vm.url)
          },
          options: {
            subject: 'Altum CMS Communication'
          }
        };

        // if staff set in referral, set appropriate stafftype
        if (data.items.staff) {
          vm.selectedStaffType = data.items.staff.staffType || null;
        }

        // if payor set in referral, filter list of programs
        if (data.items.payors.length > 0) {
          vm.programs = AltumAPI.Program.query({
            where: {
              payor: _.pluck(data.items.payors, 'id'),
              canBeTriaged: true
            }
          });
        }

        checkPrimaryProviders();

        // initialize submenu
        HeaderService.setSubmenu('referral', data.links);
      });
    }

    /**
     * checkPrimaryProviders
     * @description On-change handler for the program selector.  Depending on program changes,
     *              primaryProvider settings may need to be updated.
     */
    function checkPrimaryProviders() {
      if (vm.selectedStaffType) {
        vm.hideLoader = true;
        AltumAPI.StaffType.get({id: vm.selectedStaffType}, function (staffType) {
          vm.staffType = staffType;
          vm.providerBaseQuery = {'staffType': staffType.id};
          vm.hideLoader = false;
        });
      }
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
              return AltumAPI.Site.get({id: vm.selectedSite.id, populate: 'address'}).$promise;
            } else {
              return null;
            }
          },
          sites: function () {
            return AltumAPI.Site.query().$promise;
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
        vm.selectedSite = selectedSite;
      });
    }

    /**
     * validateSelection
     * @description Convenience function for verifying valid selections during triage
     * @param selected
     * @returns {Object|null}
     */
    function validateSelection(selected) {
      return (_.has(vm[selected], 'id') || _.isNumber(vm[selected])) ? vm[selected] : null;
    }

    /**
     * save
     * @description save handler for the triage form
     */
    function save() {
      var newReferral = new AltumAPI.Referral();

      //set values from triage form
      newReferral.site = validateSelection('selectedSite');
      newReferral.physician = validateSelection('selectedPhysician');
      newReferral.staff = validateSelection('selectedStaff');
      newReferral.program = validateSelection('selectedProgram');
      newReferral.isPhysicianPrimary = vm.isPhysicianPrimary;
      newReferral.id = vm.referralID;

      //update referral
      newReferral.$update({id: vm.referralID}).then(function (resp) {
          toastr.success('Updated referral for client ' + vm.referral.clientcontact.displayName + '!');
        },
        function (err) {
          toastr.error('Updating referral ' + vm.referralID + 'failed. ' + err);
        });
    }
  }
})();
