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
    vm.distanceDatas = [];
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

        //initialize initial select value for sites
        vm.initialSelection = 'distance';

      });
    }

    /**
     * [calculateDistances]
     * calculates the distance Matrix from the currently selected referall's origin and all of altum's sites
     * and constructs distanceData that holds sites and distance
     */
    function calculateDistances() {
      // distanceArgs for distanceMatrix call
      var distanceArgs = {
        origins: vm.origins,
        destinations: vm.destinations,
        travelMode: vm.googleMaps.TravelMode.DRIVING
      };

      vm.geoDistance.getDistanceMatrix(distanceArgs, function (matrix,status) {
        //constructs distanceData object that combines site and distance from currently selected referall to all of altum's sites
        if (status == vm.googleMaps.DistanceMatrixStatus.OK) {
          vm.distanceMatrix = matrix;
          _.each(vm.sites, function (site, index) {
            vm.distanceDatas.push({
              location: site.displayName,
              distance: parseInt(matrix.rows[0].elements[index].distance.text.replace(' km','')),
              site: site
            });
          });
        }
      });
    }
  }
})();
