/**
 *
 * Controller for handling triage
 */

(function () {
  'use strict';

  angular
    .module('altum.triage.controller', [
      'dados.common.directives.selectLoader',
      'uiGmapgoogle-maps',
      'altum.triage.mapModal.controller'
    ])
    .config(function (uiGmapGoogleMapApiProvider) {
      uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
      });
    })
    .controller('TriageController', TriageController);

  TriageController.$inject = ['$scope', 'API', 'AltumAPIService', '$location', '$uibModal', 'uiGmapGoogleMapApi', 'uiGmapIsReady','toastr'];

  function TriageController($scope, API, AltumAPI, $location, $uibModal, uiGmapGoogleMapApi, uiGmapIsReady,toastr) {
    var vm = this;

    // bindable variables
    vm.referralID = _.getParentIDFromUrl($location.path());
    vm.referral = {};
    vm.fullReferral = {};
    vm.selectedProgram = {};
    vm.selectedPhysician = {};
    vm.selectedSite = {};
    vm.map = {control: {}, center: {latitude: 43.7000, longitude: -79.4000}, zoom: 7};
    vm.sites = [];              //placeholder for sites
    vm.mapDisabled = true;
    vm.googleMaps = uiGmapGoogleMapApi;

    vm.markers = [];
    vm.tempMarkers = [];
    var referralHref = 'referral/' + 1 + '/';

    // bindable methods
    vm.openMap = openMap;
    vm.save = save;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      vm.programs = angular.copy(AltumAPI.Program.query({}));

      AltumAPI.Site.query({}).$promise.then(function (resp) {
        vm.sites = angular.copy(resp);
        return uiGmapGoogleMapApi;
      }).then(function (resp) {

        //init referral and triage form values
        AltumAPI.Referral.get({id: vm.referralID}).$promise.then(function (referral) {
          vm.referral = referral;
          vm.selectedPhysician = referral.physician || {};
          vm.selectedSite = referral.site || {};
          vm.selectedProgram = referral.program || {};
        }).then(function () {
          vm.mapDisabled = false;
        });

      });
    }

    /**
     * [openMap]
     *
     * @description opens a modal window for the mapModal site picker
     *
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
          referralHref: function () {
            //return referralHref;
            return referralHref;
          },
          sites: function () {
            return vm.sites;
          },
          referral: function () {
            return vm.referral;
          }

        }
      });

      modalInstance.result.then(function (selectedSite) {
        vm.selectedSite = selectedSite;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    }

    /**
     * [save]
     *
     * @description save handler for the triage form
     *
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
        toastr.success('Updated referral!');
      },

      function(err) {
        toastr.error('Updating referral ' + vm.referralID + 'failed. ' + err);
      });
    }

  }
})();
