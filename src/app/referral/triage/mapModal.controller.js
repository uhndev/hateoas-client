(function () {
  'use strict';

  angular
    .module('altum.triage.mapModal.controller', [
      'ui.bootstrap'
    ])
    .controller('MapModalController', MapModalController);

  MapModalController.$inject = [
    '$uibModalInstance', 'toastr', 'referralHref', 'sites', 'referral'
  ];

  function MapModalController($uibModalInstance, toastr, referralHref, sites, referral) {
    var vm = this;

    // bindable variables
    vm.selectedSite = {};
    vm.referralHref = referralHref;
    vm.sites = sites;
    vm.map = {control: {}, center: {latitude: 43.7000, longitude: -79.4000}, zoom: 7};
    vm.mapReady = true;
    vm.markers = [];
    vm.tempMarkers = [];
    vm.origins = [];
    vm.destinations = [];

    // bindable methods
    vm.selectSite = selectSite;
    vm.cancel = cancel;

    ///////////////////////////////////////////////////////////////////////////

    init();

    function init() {

      //initialize sites/destinations
      _.each(vm.sites, function (site, index) {
        vm.destinations.push({
          name: site.name,
          address: _.values(_.pick(site.address, 'address1', 'address2', 'city', 'province', 'postalCode')).join(' ')
        });

        //init client location information
        vm.origin = (referral.clientcontact.address1 || '') + ' ' + (referral.clientcontact.address2 || '') + ' ' + (referral.clientcontact.city || '') + ' ' + (referral.clientcontact.province || '') + ' ' + (referral.clientcontact.postalCode || '') + ' ' + (referral.clientcontact.country || '');
        var val = {
          idKey: index,
          id: index,
          latitude: site.address.latitude,
          longitude: site.address.longitude,
          title: site.name,
          site: site,
          icon: {url: 'assets/img/hospital-building.png'}
        };
        vm.tempMarkers.push(val);
      });

      vm.markers = vm.tempMarkers;

      var val = {
        id: 'client',
        idKey: 'client',
        latitude: referral.clientcontact.latitude,
        longitude: referral.clientcontact.longitude,
        title: referral.clientcontact.displayName,
        icon: {url: 'assets/img/patienticon.png'}
      };
      vm.selectedClientMarker = val;
      vm.mapReady = true;
    }

    /**
     * [selectSite]
     *
     * @description sets the currently selected site on the triage screen and closes the modal
     *
     */
    function selectSite() {
      $uibModalInstance.close(vm.selectedSite);
    }

    /**
     * [cancel]
     *
     * @description cancels and closes the modal window
     *
     */
    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }
  }
})();
