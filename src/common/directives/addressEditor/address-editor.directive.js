/**
 * @name address-editor
 * @description Angular component that abstracts the functionality for editing resources that has an address association
 * @example <address-editor horizontal="true" resource="CR.client.person"></address-editor>
 */

(function() {
  'use strict';

  angular
    .module('dados.common.directives.addressEditor', [])
    .controller('AddressEditorController', AddressEditorController)
    .component('addressEditor', {
      bindings: {
        horizontal: '@',
        resource: '='
      },
      templateUrl: 'directives/addressEditor/address-editor.tpl.html',
      controller: 'AddressEditorController',
      controllerAs: 'addr'
    });

  AddressEditorController.$inject = ['AltumAPIService', 'uiGmapGoogleMapApi'];

  function AddressEditorController(AltumAPI, uiGmapGoogleMapApi) {
    var vm = this;

    // bindable variables
    vm.geocodesLoading = false;
    vm.horizontal = vm.horizontal == 'true' || false;
    vm.model = vm.model || 'person';
    vm.resource = vm.resource || {};

    // bindable variables
    vm.canUpdateGeocode = canUpdateGeocode;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      uiGmapGoogleMapApi.then(function (mapsAPI) {
        // init googleMaps object
        vm.googleMaps = mapsAPI;

        // init geocoder
        vm.geocoder = new vm.googleMaps.Geocoder();

        // if just address ID, fetch data
        if (_.isNumber(vm.resource.address) && !_.isNull(vm.resource.address)) {
          vm.resource.address = AltumAPI.Address.get({id: vm.resource.address});
        }
      });
    }

    /**
     * canUpdateGeocode
     * @description Callback on ng-blur that will attempt to populate lat/lng fields given a complete enough address.
     * @param isAddressFormValid
     */
    function canUpdateGeocode(isAddressFormValid) {
      if (isAddressFormValid && (!vm.resource.address.latitude || !vm.resource.address.longitude)) {
        vm.geocodesLoading = true;
        vm.resource.address.latitude = 'Loading...';
        vm.resource.address.longitude = 'Loading...';
        vm.geocoder.geocode({
          address: _.values(_.pick(vm.resource.address, 'address1', 'address2', 'city', 'province', 'postalCode', 'country')).join(' ')
        }, function (location) {
          vm.geocodesLoading = false;
          if (location.status === 'OK') {
            var latitude = _.first(location).geometry.location.lat();
            var longitude = _.first(location).geometry.location.lng();
            vm.resource.address.latitude = latitude;
            vm.resource.address.longitude = longitude;
          } else {
            delete vm.resource.address.latitude;
            delete vm.resource.address.longitude;
          }
        });
      }
    }
  }

})();
