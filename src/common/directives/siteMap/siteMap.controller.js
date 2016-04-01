/**
 * Directive controller for SiteMap
 */

(function () {
  'use strict';

  angular
    .module('dados.common.directives.siteMap.controller', [
      'uiGmapgoogle-maps',
      'toastr'
    ])
    .config(function (uiGmapGoogleMapApiProvider) {
      uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
      });
    })
    .controller('SiteMapController', SiteMapController);

  SiteMapController.$inject = ['$scope', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'toastr', 'AddressService'];

  function SiteMapController($scope, uiGmapGoogleMapApi, uiGmapIsReady, toastr, Address) {
    var vm = this;

    // bindable variables
    vm.googleMaps = null;
    vm.directionsService = null;
    vm.directionsDisplay = null;
    vm.travelModes = {};
    vm.selectedTravelMode = 'DRIVING';

    // bindable methods
    vm.selectSite = selectSite;
    vm.calculateDirections = calculateDirections;
    vm.resetDirections = resetDirections;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      // init maps api object
      uiGmapGoogleMapApi.then(function (mapsAPI) {

        // init googleMaps object
        vm.googleMaps = mapsAPI;

        // initialize directions service
        vm.directionsService = new vm.googleMaps.DirectionsService();

        // init directions renderer
        vm.directionsDisplay = new vm.googleMaps.DirectionsRenderer();

        // init geocoder
        vm.geocoder = new vm.googleMaps.Geocoder();

        //init travelModes
        vm.travelModes = vm.googleMaps.DirectionsTravelMode;

        var unregister = $scope.$watch('sitemap.markers', function (newMarkers, oldMarkers) {
          if (newMarkers.length > 1) {
            //init marker click functions
            _.each(newMarkers, function (marker) {
              marker.click = function () {
                selectSite(marker.site);
              };
            });

            unregister();
          }
        }, true);

        $scope.$watch('sitemap.selectedClientMarker', function (newClientMarker, oldClientMarker) {
          if (newClientMarker !== null && newClientMarker.id === 'client') {
            vm.markers.push(newClientMarker);
          } else {
            _.find(vm.markers, {id: 'client'}).latitude = newClientMarker.latitude;
            _.find(vm.markers, {id: 'client'}).longitude = newClientMarker.longitude;
          }
          resetDirections();
        }, true);

        $scope.$watch('sitemap.selectedSite', function (newSite, oldSite) {
          if (newSite !== oldSite) {
            resetDirections();
          }
        }, true);
      });
    }

    /**
     * calculateDirections
     * @description Takes an array of origin/destination addresses and hits the
     *              google maps directions service and set the returned route
     *              on the map and in the directions div
     *
     * @param origin
     * @param destination
     */
    function calculateDirections(origin, destination) {

      //prepare the request
      var request = {
        origin: origin,
        destination: destination,
        travelMode: vm.selectedTravelMode
      };

      //get the route back from the service
      vm.directionsService.route(request, function (response) {
        if (response.status === vm.googleMaps.DirectionsStatus.OK) {

          // set the route on the map/dirctions display
          vm.directionsDisplay.setDirections(response);

          //scope.apply is a workaround for an angular google maps bug with how they handle scopes
          //TODO: this should be changed when the bug is fixed, but who knows when that will be
          $scope.$apply(function () {
              //set the directions steps
              vm.directionsSteps = response.routes[0].legs[0].steps;
              return uiGmapIsReady.promise(1);
            })
            .then(function (instances) {
              var instanceMap = instances[0].map;
              vm.directionsDisplay.setMap(instanceMap);
              vm.directionsDisplay.setDirections(response);

              // this is not the angular way, at all, and I hate it, but it works. Want to change it
              //TODO: change this crap
              vm.directionsDisplay.setPanel(document.getElementById('directionsDiv'));
            });
        } else {
          toastr.warning('Problem getting route from Google Maps. Are locations set?');
        }
      });
    }

    /**
     * selectSite
     * @description takes a site object, calculates origin/destination based on the client/passed site
     * and calls calculateDirections to express the new route on the map
     *
     * @param site
     */
    function selectSite(site) {
      vm.selectedSite = site;
      resetDirections();
    }

    /**
     * resetDirections
     * @description called off of watches and changes to the travelMode, resets the directions per the currently
     * selectedSite and currently selected Client Marker
     */
    function resetDirections() {
      var configureDirectionsCalculation = function() {
        if (_.has(vm.selectedSite.address, 'latitude') && _.has(vm.selectedSite.address, 'longitude') && vm.selectedClientMarker) {
          var origin = new vm.googleMaps.LatLng(vm.selectedClientMarker.latitude, vm.selectedClientMarker.longitude);
          var destination = new vm.googleMaps.LatLng(vm.selectedSite.address.latitude, vm.selectedSite.address.longitude);

          calculateDirections(origin, destination);
        }
      };

      if (!vm.selectedClientMarker.latitude || !vm.selectedClientMarker.longitude) {
        geocodeAddress(vm.selectedClientMarker, function (updatedMarker) {
          vm.selectedClientMarker.latitude = updatedMarker.latitude;
          vm.selectedClientMarker.longitude = updatedMarker.longitude;
          configureDirectionsCalculation();
        });
      } else {
        configureDirectionsCalculation();
      }
    }

    /**
     * geocodeAddress
     * @description This function takes an address string and sets latitude and longitude on the record
     */
    function geocodeAddress(marker, callback) {
      vm.geocoder.geocode({address: marker.addressName}, function (location) {
        if (location[0]) {
          var latitude = location[0].geometry.location.lat();
          var longitude = location[0].geometry.location.lng();
          Address.update({
            id: marker.addressID,
            latitude: latitude,
            longitude: longitude
          }, function (updatedAddress) {
            marker.latitude = latitude;
            marker.longitude = longitude;
            callback(marker);
          });
        }
      });
    }

  }
})();
