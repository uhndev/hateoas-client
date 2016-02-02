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
    vm.markers = [];
    vm.destinationDistance={};

    // bindable methods
    vm.calculateDistances = calculateDistances;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {

      //init maps api object
      uiGmapGoogleMapApi.then(function(mapsAPI) {

        vm.googleMaps=mapsAPI;

        //initialize distance API
        vm.geoDistance = new mapsAPI.DistanceMatrixService();
        $scope.$watch('distance.origins', function() {
          calculateDistances();
        });
      });
    }

    /**
     * [calculateDistances]
     * calculates the distance Matrix from the currently selected referall's client and all of altum's sites
     * @param {none}
     */

    function calculateDistances() {
      // distanceArgs for distanceMatrix call
      var distanceArgs = {
        origins: _.pluck(vm.origins, 'address'),
        destinations: _.pluck(vm.destinations, 'address'),
        travelMode: vm.googleMaps.TravelMode.DRIVING
      };

      vm.geoDistance.getDistanceMatrix(distanceArgs, function (matrix) {
        vm.distanceMatrix = matrix;
      });
    }
  }
})();
