/**
 *
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

  SiteMapController.$inject = ['$scope', 'uiGmapGoogleMapApi', 'uiGmapIsReady','toastr'];

  function SiteMapController($scope, uiGmapGoogleMapApi, uiGmapIsReady,toastr) {
    var vm = this;

    // bindable variables
    vm.googleMaps = null;
    vm.directionsService = null;
    vm.directionsDisplay = null;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {

      //init maps api object
      uiGmapGoogleMapApi.then(function(mapsAPI) {

        //init googleMaps object
        vm.googleMaps = mapsAPI;

        //initialize directions service
        vm.directionsService = new vm.googleMaps.DirectionsService();

        //init directions renderer
        vm.directionsDisplay = new vm.googleMaps.DirectionsRenderer();

      });
    }

    /**
     * calculateDirections
     *
     * takes an array of origin/destination addresses and hits the
     * google maps directions service and set the returned route
     * on the map and in the directions div
     *
     * @param origin
     * @param destination
     */

    function calculateDirections(origin, destination) {

      //prepare the request
      var request = {
        origin: origins,
        destination: destinations,
        travelMode: vm.googleMaps.DirectionsTravelMode.DRIVING
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
     * geocodeSites
     *
     * this function takes the site addresses and geocodes them storing the long/latt of each site...
     * TODO: this function likely belongs somewhere else, but is unused now, maybe on a hook in the address model? artifact
     *
     */

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
