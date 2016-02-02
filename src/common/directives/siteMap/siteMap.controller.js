/**
 *
 * Directive controller for Distance Matrix
 */

(function () {
  'use strict';

  angular
    .module('dados.common.directives.siteMap.controller', [
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
    vm.googleMaps = null;
    vm.directionsService = null;
    vm.directionsDisplay = null;
    vm.mapReady=false;
    vm.map = {control: {}, center: {latitude: 43.7000, longitude: -79.4000}, zoom: 7};

    // google placeholders for directions call
    vm.markers = [];

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {

      //init maps api object
      uiGmapGoogleMapApi.then(function(mapsAPI) {

        //init googleMaps object
        vm.googleMaps = mapsAPI;
/*
        //initialize sites/destinations
        _.each(vm.sites, function (site, index) {
          vm.destinations.push(_.values(_.pick(site.address, 'address1', 'address2', 'city', 'province', 'postalCode')).join(' '));
          var val = {
            id: index,
            idKey: index,
            latitude: site.address.latitude,
            longitude: site.address.longitude,
            title: site.name,
            icon: {url: vm.destinationIcon},
            click: function (arg) {
              vm.destinationClick(arg.model.site);
            }
          };
          vm.markers.push(val);
        });
*/

        //initialize directions service
        vm.directionsService = new vm.googleMaps.DirectionsService();

        //init directions renderer
        vm.directionsDisplay = new vm.googleMaps.DirectionsRenderer();

        vm.mapReady=true;

      });
    }

    /**
     * calculateDirections
     * @param origin
     * @param destination
     */

    function calculateDirections(origin, destination) {
      var request = {
        origin: origins,
        destination: destinations,
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
