/**
 *
 * Controller for handling assessments
 */

(function () {
  'use strict';

  angular
    .module('altum.assessment.controller', [
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

  AssessmentController.$inject = ['$scope', 'AltumAPIService', 'uiGmapGoogleMapApi', 'uiGmapIsReady'];

  function AssessmentController($scope, AltumAPI, uiGmapGoogleMapApi, uiGmapIsReady) {
    var vm = this;

    // bindable variables
    vm.referrals = [];
    vm.referralList = [];
    vm.collapsedSearch = false;
    vm.collapsedClientDetail = true;
    vm.selectedReferral = {};
    vm.selectedProgram = {};
    vm.availableServices = [];
    vm.currentCategories = [];
    vm.selectedSite = {};
    vm.recommendedServices = [];
    vm.siteMatrix = {};
    vm.map = {control: {}, center: {latitude: 43.7000, longitude: -79.4000}, zoom: 7};
    vm.sites = [];              //placeholder for sites
    vm.programs = [];           //placeholder for programs
    vm.siteLocations = [];
    vm.mapReady = false;
    vm.geocoder = null;
    vm.geoDirections = null;
    vm.geoDistance = null;
    vm.directionsService = null; //placeholder for directionsService object
    vm.googleMaps = uiGmapGoogleMapApi;
    vm.fullReferral = null;
    vm.searchOpenReferrals = true;

    //placeholders for data driving form dropdowns/radios
    vm.workStatuses = [];
    vm.prognosises = [];

    // google distance placeholders for distance call
    vm.origins = [];
    vm.destinations = [];
    vm.myorigins = [];
    vm.mydestinations = [];
    vm.distanceMatrix = [];
    vm.directionsSteps = [];
    vm.markers = [];
    vm.tempMarkers=[];
    vm.selectedClientMarker={};

    // bindable methods
    vm.selectProgram = selectProgram;
    vm.resetServices = resetServices;
    vm.findReferral = findReferral;
    vm.toggleService = toggleService;
    vm.saveServices = saveServices;
    vm.isServiceRecommended = isServiceRecommended;
    vm.selectReferral = selectReferral;
    vm.geocodeSites = geocodeSites;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      vm.programs = angular.copy(AltumAPI.Program.query({}));

      vm.workStatuses = AltumAPI.WorkStatus.query({});

      vm.prognosises = AltumAPI.Prognosis.query({});

      AltumAPI.Site.query({}).$promise.then(function (resp) {
          vm.sites = angular.copy(resp);
          return uiGmapGoogleMapApi;
        })
        .then(function (maps) {
          //init googleMaps object
          vm.googleMaps = maps;

          //initialize sites/destinations
          _.each(vm.sites, function (site, index) {
            vm.destinations.push(_.values(_.pick(site.address, 'address1', 'address2', 'city', 'province', 'postalCode')).join(' '));
            vm.mydestinations.push({
              name: site.name,
              address: _.values(_.pick(site.address, 'address1', 'address2', 'city', 'province', 'postalCode')).join(' ')
            });
            var val = {
              idKey: index,
              id: index,
              latitude: site.address.latitude,
              longitude: site.address.longitude,
              title: site.name,
              site: site,
              icon: {url: 'assets/img/hospital-building.png'}
            };
            vm.tempMarkers.push(val);
          });

          vm.markers=vm.tempMarkers;
        });
    }

    function findReferral(searchString) {
      AltumAPI.ReferralDetail.query({
        where: {
          or: [
            {id: parseInt(searchString)},
            {client_firstName: {contains: searchString}},
            {client_lastName: {contains: searchString}},
            {claim_claimNum: {contains: searchString}},
            {claim_policyNum: {contains: searchString}}
          ]
          //TODO: add to query recommendations false flag recommendationsMade: false
        }
      }).$promise.then(function (resp) {
            vm.referralList = resp;
            vm.referrals = resp;
            vm.collapsedSearch = false;
        },

        function error(err) {
          alert('error');
        }
      );
    }

    /**
     * [isServiceRecommended]
     * returns bool reporting if service is recommended.
     * @param {String} service
     */

    function isServiceRecommended(service) {
      return _.contains(vm.recommendedServices, service);
    }

    /**
     * [toggleService]
     * adds/removes a progrmService from recommendedServices
     * @param {String} service
     */

    function toggleService(service) {
      if (isServiceRecommended(service)) {
        vm.recommendedServices = _.without(vm.recommendedServices, service);
      } else {
        vm.recommendedServices.push(service);
      }
    }

    /**
     * [saveServices]
     * saves the currently selected services to the current referral
     * @param {String} service
     */

    function saveServices() {
      vm.fullReferral.services = _.union(vm.recommendedServices, vm.fullReferral.services);
      AltumAPI.Referral.update(vm.fullReferral);
    }

    /**
     * [selectProgram]
     * changes the selected program of the currently selected referral
     * @param {String} service
     */

    function selectProgram() {

      AltumAPI.AltumProgramServices.query({
        where: [
          {id: vm.selectedReferral.program}
        ]
      }).$promise
        .then(
          function (resp) {
            vm.availableServices=resp; //assign the newly selected programServices
            vm.recommendedServices = {}; //reset recommended services to clear box
          },

          function error(err) {
            //console.log("Error querying program " + vm.selectedReferral.program.name + " with id " + vm.selectedReferral.program.id);
            console.log(err);
          }
      );
    }

    /**
     * [selectReferral]
     * click handler for picking referral from search results lists in recommendation manager
     * @param {String} referral
     */

    function selectReferral(referral) {
      vm.selectedReferral = referral;

      AltumAPI.Referral.query({
        where: {
          id: vm.selectedReferral.id
        }
      }).$promise.then(function (resp) {
          vm.fullReferral = resp[0];
        //  vm.resetServices();
          vm.recommendedServices = [];
        },
        function error(err) {
          alert('error');
        });

      // set origin for distance matrix
      vm.origins = [(referral.client_address1 || '') + ' ' + (referral.client_address2 || '') + ' ' + (referral.client_city || '') + ' ' + (referral.client_province || '') + ' ' + (referral.client_postalCode || '') + ' ' + (referral.client_country || '')];
      vm.myorigins = [{
        name: referral.client_firstName + ' ' + referral.client_lastName,
        address: (referral.client_address1 || '') + ' ' + (referral.client_address2 || '') + ' ' + (referral.client_city || '') + ' ' + (referral.client_province || '') + ' ' + (referral.client_postalCode || '') + ' ' + (referral.client_country || '')
      }];

      // hide the search, unhide client detail on front end, unhide map
      vm.collapsedSearch = true;
      vm.collapsedClientDetail = false;
      vm.mapReady = true;

      var val = {
        id: 'client',
        idKey: 'client',
        latitude: referral.client_latitude,
        longitude: referral.client_longitude,
        title: referral.client_name,
        icon: {url: 'assets/img/patienticon.png'}
      };
      vm.selectedClientMarker=val;

      vm.map = {
        control: {},
        center: {latitude: referral.client_latitude, longitude: referral.client_longitude},
        zoom: 10
      };

      //vm.calculateDistances();
      //var origin = new vm.googleMaps.LatLng(vm.selectedReferral.client_latitude, vm.selectedReferral.client_longitude);

    }

    /**
     * [resetServices]
     * resets the available list of services to an empty set of the referral's programs's available services
     */
    function resetServices() {
      AltumAPI.ProgramService.query({
        where: {
          program: parseInt(vm.fullReferral.program)
        }
      }).$promise.then(function (resp) {
        vm.availableServices = resp;
        vm.currentCategories = _.unique(_.pluck(resp, 'serviceCategory'), 'id');
        _.each(resp, function (programService, index) {
          vm.availableServices.push({
            name: programService.name,
            referral: vm.fullReferral.id,
            programService: programService.id,
            serviceCategory: programService.serviceCateory
          });
        });
      });
    }


    function geocodeSites() {
      vm.sites.forEach(function (site) {
        var addy = (site.address.address1 || '') + ' ' + (site.address.address2 || '') + ' ' + (site.address.city || '') + ' ' + (site.address.province || '') + ', ' + (site.address.postalCode || '');
        vm.geocoder.geocode({address: addy}, function (location) {
          if (location[0]) {

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
