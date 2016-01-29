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
    .controller('SiteMapController', SiteMapController);

  SiteMapController.$inject = ['$scope', 'uiGmapGoogleMapApi', 'uiGmapIsReady'];

  function SiteMapController($scope, uiGmapGoogleMapApi, uiGmapIsReady) {
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

        //init googleMaps object
        vm.googleMaps = maps;

        //initialize sites/destinations
        _.each(vm.sites, function (site, index) {
          vm.destinations.push(_.values(_.pick(site.address, 'address1', 'address2', 'city', 'province', 'postalCode')).join(' '));
          var val = {
            id: index,
            idKey: index,
            latitude: site.address.latitude,
            longitude: site.address.longitude,
            title: site.name,
            icon: {url: 'assets/img/hospital-building.png'},
            click: function () {
              selectSite(site);
            }
          };
          vm.markers.push(val);
        });

        //initialize geocoder
        vm.geocoder = new vm.googleMaps.Geocoder();

        //initialize distance
        vm.geoDistance = new vm.googleMaps.DistanceMatrixService();

        //initialize directions service
        vm.directionsService = new vm.googleMaps.DirectionsService();

        //init directions renderer
        vm.directionsDisplay = new vm.googleMaps.DirectionsRenderer();
      });

    }

    /**
     * calculateDirections
     * @param origin
     * @param destination
     */
    function calculateDirections(origin, destination) {
      var request = {
        origin: origin,
        destination: destination,
        travelMode: vm.googleMaps.DirectionsTravelMode.DRIVING
      };

      vm.directionsService.route(request, function (response) {
        if (response.status === vm.googleMaps.DirectionsStatus.OK) {
          // set routes
          vm.directionsDisplay.setDirections(response);
          $scope.$apply(function () {
            // vm.directionsDisplay.setMap($scope.map.control.getGMap());

            vm.directionsSteps = response.routes[0].legs[0].steps;
            return uiGmapIsReady.promise(1);
          })
            .then(function (instances) {
              var instanceMap = instances[0].map;
              vm.directionsDisplay.setMap(instanceMap);
              vm.directionsDisplay.setDirections(response);
              // this is not the angular way, at all, and I hate it, but it works. Want to change it

              vm.directionsDisplay.setPanel(document.getElementById('directionsDiv'));
            });
        }
      });
    }

    function geocodeSites() {
      vm.sites.forEach(function (site) {
        console.log(site);
        var addy = (site.address.address1 || '') + ' ' + (site.address.address2 || '') + ' ' + (site.address.city || '') + ' ' + (site.address.province || '') + ', ' + (site.address.postalCode || '');
        vm.geocoder.geocode({address: addy}, function (location) {
          console.log(location);
          if (location[0]) {
            console.log(location);

            var newSite = new Site(site);
            newSite.address.latitude = location[0].geometry.location.lat();
            newSite.address.longitude = location[0].geometry.location.lng();
            newSite.$update({id: site.id})
              .then(function () {
                toastr.success('Site geolocation updated', 'Geolocation');
              })
              .finally(function () {
                newSite = {};
                location = {};
              });
            newSite.$update(newSite);
          }
        });
      });
    }


  }
})();
