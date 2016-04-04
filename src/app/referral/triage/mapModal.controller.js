(function () {
  'use strict';

  angular
    .module('altum.triage.mapModal.controller', [
      'ui.bootstrap'
    ])
    .controller('MapModalController', MapModalController);

  MapModalController.$inject = [
    '$uibModalInstance', 'selectedSite', 'sites', 'referral'
  ];

  function MapModalController($uibModalInstance, selectedSite, sites, referral) {
    var vm = this;

    // bindable variables
    vm.selectedSite = selectedSite || {};
    vm.sites = sites;
    vm.map = {control: {}, center: {latitude: 43.7000, longitude: -79.4000}, zoom: 7};
    vm.mapReady = true;
    vm.markers = [];
    vm.origins = [];
    vm.destinations = [];

    // bindable methods
    vm.selectSite = selectSite;
    vm.cancel = cancel;

    ///////////////////////////////////////////////////////////////////////////

    init();

    function init() {
      // init client location information
      vm.origin = referral.addressName;

      // initialize sites/destinations
      _.each(sites, function (site, index) {
        vm.destinations.push({
          name: site.name,
          address: _.values(_.pick(site.address, 'address1', 'address2', 'city', 'province', 'postalCode')).join(' ')
        });
        vm.markers.push({
          idKey: index,
          id: index,
          latitude: site.address.latitude,
          longitude: site.address.longitude,
          title: site.name,
          site: site,
          icon: {url: 'assets/img/hospital-building.png'}
        });
      });

      vm.selectedClientMarker = {
        id: 'client',
        idKey: 'client',
        latitude: referral.latitude,
        longitude: referral.longitude,
        title: referral.title,
        icon: {url: 'assets/img/patienticon.png'},
        addressID: referral.addressID,
        addressName: vm.origin
      };

      vm.mapReady = true;
    }

    /**
     * selectSite
     * @description sets the currently selected site on the triage screen and closes the modal
     */
    function selectSite() {
      $uibModalInstance.close(vm.selectedSite);
    }

    /**
     * cancel
     * @description cancels and closes the modal window
     */
    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }
  }
})();
