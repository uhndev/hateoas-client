/**
 *
 * Directive controller for Distance Matrix
 */

(function () {
  'use strict';

  angular
    .module('dados.common.directives.distanceMatrix.controller', [
      'uiGmapgoogle-maps'
    ])
    .config(function (uiGmapGoogleMapApiProvider) {
      uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
      });
    })
    .controller('DistanceMatrixController', DistanceMatrixController);

  DistanceMatrixController.$inject = ['$scope', 'uiGmapGoogleMapApi', 'uiGmapIsReady'];

  function DistanceMatrixController($scope, uiGmapGoogleMapApi, uiGmapIsReady) {
    var vm = this;

    // bindable variables
    vm.geoDistance = null;
    vm.googleMaps = null;

    // google distance placeholders for distance call
    vm.distanceMatrix = [];
    vm.destinationDistance = {};
    vm.destinations = [];
    vm.origins = [];

    // bindable methods
    vm.calculateDistances = calculateDistances;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {

      //init maps api object
      uiGmapGoogleMapApi.then(function (mapsAPI) {

        vm.googleMaps = mapsAPI;

        //initialize distance API
        vm.geoDistance = new mapsAPI.DistanceMatrixService();

        $scope.$watch('distance.origin', function (newOrigin, oldOrigin) {
          console.log(newOrigin);
          vm.origins = [];
          vm.origins.push(newOrigin);
          calculateDistances();
        });

        $scope.$watch('distance.sites', function (newSites,oldSites) {
          //initialize sites/destinations
          vm.destinations = [];
          _.each(newSites, function (site, index) {
            vm.destinations.push(_.values(_.pick(site.address, 'address1', 'address2', 'city', 'province', 'postalCode')).join(' '));
          });
          calculateDistances();
        });
      });
    }

    /**
     * [calculateDistances]
     * calculates the distance Matrix from the currently selected referall's origin and all of altum's sites
     */
    function calculateDistances() {
      // distanceArgs for distanceMatrix call
      var distanceArgs = {
        origins: vm.origins,
        destinations: vm.destinations,
        travelMode: vm.googleMaps.TravelMode.DRIVING
      };

      vm.geoDistance.getDistanceMatrix(distanceArgs, function (matrix) {
        vm.distanceMatrix = matrix;
      });
    }
  }
})();
