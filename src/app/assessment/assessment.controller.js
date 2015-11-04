/**
 *
 * Controller for handling assessments
 */

(function () {
  'use strict';

  angular
    .module('dados.arm.assessment.controller', [
      'dados.common.directives.selectLoader',
      'uiGmapgoogle-maps'
    ])
    .config(function (uiGmapGoogleMapApiProvider) {
      uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
      });
    })
    .controller('AssessmentController', AssessmentController);

  AssessmentController.$inject = ['$scope', 'AssessmentService', 'ReferralService', 'ReferralDetailService', 'SiteService', 'uiGmapGoogleMapApi', 'PhysicianService', 'ProgramService', 'uiGmapIsReady'];

  function AssessmentController($scope, Assessment, Referral, ReferralDetail, Site, uiGmapGoogleMapApi, Physician, Program, uiGmapIsReady) {
    var vm = this;

    // bindable variables
    vm.referrals = [];
    vm.referralList = [];
    vm.collapsedSearch = false;
    vm.collapsedClientDetail = true;
    vm.selectedReferral = {};
    vm.selectedSite= {};
    vm.siteMatrix = {};
    vm.map = {control: {}, center: {latitude: 43.7000, longitude: -79.4000}, zoom: 7};
    vm.sites = [];            //placeholder for sites
    vm.programs = [];           //placeholder for programs
    vm.siteLocations = [];
    vm.mapReady = false;
    vm.geocoder = null;
    vm.geoDirections = null;
    vm.geoDistance = null;
    vm.directionsService = null; //placeholder for directionsService object
    vm.googleMaps = uiGmapGoogleMapApi;

    // google distance placeholders for distance call
    vm.origins = [];
    vm.destinations = [];
    vm.distanceMatrix = [];
    vm.directionsSteps = [];
    vm.markers = [];

    // bindable methods
    vm.findReferral = findReferral;
    vm.selectReferral = selectReferral;
    vm.calculateDistances = calculateDistances;
    vm.calculateDirections = calculateDirections;
    vm.geocodeSites = geocodeSites;
    vm.selectSite = selectSite;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      Program.query({}).$promise.then(function (resp) {
        vm.programs = angular.copy(resp);
      });

      Site.query({}).$promise.then(function (resp) {
        vm.sites = angular.copy(resp);
        return uiGmapGoogleMapApi;
      })
        .then(function (maps) {
          //init googleMaps object
          vm.googleMaps = maps;

          //initialize sites/destinations
          _.each(vm.sites, function (site, index) {
            //vm.destinations.push((site.address.address1 || '') + ' ' + (site.address.address2 || '') + ' ' + (site.address.city || '') + ' ' + (site.address.province || '') + ' ' + (site.address.postalCode || '') + ' ' + (site.address.country || ''));
            vm.destinations.push(_.values(_.pick(site.address, 'address1', 'address2', 'city', 'province', 'postalCode')).join(' '));
            var val = {
              idKey: index,
              latitude: site.address.latitude,
              longitude: site.address.longitude,
              title: site.name,
              icon: {url: 'assets/img/hospital-building.png'},
              click: function () {
                selectSite(site);
              }
            };
            val["id"] = index;
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

    function findReferral(searchString) {
      ReferralDetail.query({
        where: {
          or: [
            {status: {contains: searchString}},
            {id: parseInt(searchString)},
            {client_firstName: {contains: searchString}},
            {client_lastName: {contains: searchString}},
            {claim_claimNum: {contains: searchString}},
            {claim_policyNum: {contains: searchString}}
          ]
        }
      }).$promise
        .then(function (resp) {
          vm.referralList = resp;
          vm.referrals = resp;
          vm.collapsedSearch = false;
        },
        function error(err) {
          alert('error');
        });
    }

    function selectReferral(referral) {
      vm.selectedReferral = referral;

      // set origin for distance matrix
      vm.origins = [(referral.client_address1 || '') + ' ' + (referral.client_address2 || '') + ' ' + (referral.client_city || '') + ' ' + (referral.client_province || '') + ' ' + (referral.client_postalCode || '') + ' ' + (referral.client_country || '')];

      // hide the search, unhide client detail on front end, unhide map
      vm.collapsedSearch = true;
      vm.collapsedClientDetail = false;
      vm.mapReady = true;

      var val = {
        idKey: 'client',
        latitude: referral.client_latitude,
        longitude: referral.client_longitude,
        title: referral.client_name,
        icon: {url: 'assets/img/firstaid.png'},
        click: function () {
          selectSite(site);
        }
      };
      val["id"] = 'client';
      vm.markers.pop();
      vm.markers.push(val);

      vm.map = {
        control: {},
        center: {latitude: referral.client_latitude, longitude: referral.client_longitude},
        zoom: 10
      };

      vm.calculateDistances();
      var origin = new vm.googleMaps.LatLng(vm.selectedReferral.client_latitude, vm.selectedReferral.client_longitude);
      var destination = new vm.googleMaps.LatLng(vm.selectedSite.address.latitude, vm.selectedSite.address.longitude);
      vm.calculateDirections(origin, destination);
      //vm.geocodeSites();
    }

    function calculateDistances() {
      //distanceArgs for distanceMatrix call

      var distanceArgs = {
        origins: vm.origins,
        destinations: vm.destinations,
        travelMode: vm.googleMaps.TravelMode.DRIVING
      };

      vm.geoDistance.getDistanceMatrix(distanceArgs, function (matrix) {

        vm.distanceMatrix = matrix;
      });
    }

    function calculateDirections(origin, destination) {
      var request = {
        origin: origin,
        destination: destination,
        travelMode: vm.googleMaps.DirectionsTravelMode.DRIVING
      };

      vm.directionsService.route(request, function (response) {
        if (response.status === vm.googleMaps.DirectionsStatus.OK) {

          //vm.directionsDisplay.setDirections(response);
          //vm.directionsDisplay.setMap(vm.map.control.getGMap());
          //vm.directionsDisplay.setPanel(vm.map.control.getGMap());
//alert('wait');
          //set routes
          vm.directionsDisplay.setDirections(response);
          $scope.$apply(function () {

            //vm.directionsDisplay.setMap($scope.map.control.getGMap());

            vm.directionsSteps = response.routes[0].legs[0].steps;
            return uiGmapIsReady.promise(1);
          })
          .then(function(instances) {
              var instanceMap=instances[0].map;
              vm.directionsDisplay.setMap(instanceMap);
              vm.directionsDisplay.setDirections(response);

              //this is not the angular way, at all, and I hate it, but it works. Want to change ti

              vm.directionsDisplay.setPanel(document.getElementById('directionsDiv'));
          });
          console.log(vm.directionsSteps);
        }
      });
    }

    function geocodeSites() {
      vm.sites.forEach(function (site) {
        console.log(site);
        var addy = (site.address.address1 || '' ) + ' ' + (site.address.address2 || '') + ' ' + (site.address.city || '') + ' ' + (site.address.province || '') + ', ' + (site.address.postalCode || '');
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
      // addy=[{address: '399 Bathurst, Toronto, ON'},{address: '5 abbot lane truro NS'}];
    }

    function selectSite(site) {
      //alert('you just clicked the ' + site.name + ' site');
      //vm.geocodeSites();
      //console.log(vm.directionsSteps);

      vm.selectedSite=site;
      var origin = new vm.googleMaps.LatLng(vm.selectedReferral.client_latitude, vm.selectedReferral.client_longitude);
      var destination = new vm.googleMaps.LatLng(site.address.latitude, site.address.longitude);

      vm.calculateDirections(origin, destination);
    }
  }
})();
