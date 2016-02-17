(function () {
  'use strict';

  angular
    .module('altum.referral', [])
    .controller('ReferralController', ReferralController);

  ReferralController.$inject = [
    '$q', '$resource', '$location', 'API', 'HeaderService',
    'ReferralService', 'AltumProgramServices', 'NoteTypeService', 'toastr'
  ];

  function ReferralController($q, $resource, $location, API, HeaderService, Referral,
                              AltumProgramServices, NoteType, toastr) {
    var vm = this;
    var ReferralServices;

    // bindable variables
    vm.url = API.url() + $location.path();
    vm.selectedProgram = null;
    vm.selectedSite = null;
    vm.selectedPhysician = null;
    vm.noteUrl = vm.url + '/notes';
    vm.noteTypes = NoteType.query();

    vm.style_notebarCollapsed = false;

    vm.recommendedServices = [];
    vm.availableServices = [];
    vm.currentCategories = [];

    // bindable methods
    vm.updateReferral = updateReferral;
    vm.resetServices = resetServices;
    vm.isServiceRecommended = isServiceRecommended;
    vm.toggleService = toggleService;
    vm.saveServices = saveServices;

    vm.toggleNotebar = toggleNotebar;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Resource = $resource(vm.url);
      ReferralServices = $resource(vm.url + '/services');

      Resource.get(function (data, headers) {
        vm.allow = headers('allow');
        vm.template = data.template;
        vm.referral = angular.copy(data.items);

        vm.selectedProgram = data.items.program;
        vm.selectedSite = data.items.site;
        vm.selectedPhysician = data.items.physician;
        vm.selectedClinician = data.items.clinician;
        vm.selectedStatus = data.items.status;
        vm.notes = data.items.notes;

        var clientData = _.pick(vm.referral.clientcontact, 'MRN', 'displayName', 'dateOfBirth');
        var referralData = _.pick(vm.referral, 'program', 'site', 'physician', 'clinician', 'referralContact',
          'referralDate', 'clinicDate', 'accidentDate', 'sentDate', 'receiveDate', 'dischargeDate', 'statusName');

        // referral info panel
        vm.referralInfo = {
          rows: {
            'MRN': {title: 'COMMON.MODELS.CLIENT.MRN', type: 'text'},
            'displayName': {title: 'COMMON.MODELS.PERSON.NAME', type: 'text'},
            'dateOfBirth': {title: 'COMMON.MODELS.PERSON.DATE_OF_BIRTH', type: 'date'},
            'program': {title: 'Program', type: 'program'},
            'site': {title: 'Site', type: 'site'},
            'physician': {title: 'Physician', type: 'physician'},
            'clinician': {title: 'Clinician', type: 'clinician'},
            'referralContact': {title: 'Referral Contact', type: 'employee'},
            'referralDate': {title: 'COMMON.MODELS.REFERRAL.REFERRAL_DATE', type: 'date'},
            'clinicDate': {title: 'COMMON.MODELS.REFERRAL.CLINIC_DATE', type: 'date'},
            'accidentDate': {title: 'COMMON.MODELS.REFERRAL.ACCIDENT_DATE', type: 'date'},
            'sentDate': {title: 'COMMON.MODELS.REFERRAL.SENT_DATE', type: 'date'},
            'receiveDate': {title: 'COMMON.MODELS.REFERRAL.RECEIVE_DATE', type: 'date'},
            'dischargeDate': {title: 'COMMON.MODELS.REFERRAL.DISCHARGE_DATE', type: 'date'},
            'statusName': {title: 'COMMON.MODELS.REFERRAL.STATUS', type: 'text'}
          },
          tableData: _.objToPair(_.merge(clientData, referralData))
        };

        // initialize submenu
        HeaderService.setSubmenu('referral', data.links);
      });
    }

    /**
     * updateReferral
     * @description Saves program and physician selections for a selected referral
     */
    function updateReferral() {
      if (vm.selectedProgram && vm.selectedSite && vm.selectedPhysician) {
        var updateObj = {
          program: vm.selectedProgram,
          site: vm.selectedSite,
          physician: vm.selectedPhysician
        };

        if (vm.selectedClinician) {
          updateObj.clinician = vm.selectedClinician;
        }
        if (vm.selectedStatus) {
          updateObj.status = vm.selectedStatus;
        }

        var referral = new Referral(updateObj);
        referral
          .$update({id: vm.referral.id})
          .then(function () {
            toastr.success('Updated referral for client: ' + vm.referral.clientcontact.displayName, 'Triage');
            init();
          });
      } else {
        toastr.warning('You must select a program/site/physician!', 'Triage');
      }
    }

    /**
     * resetServices
     * @description Resets the available list of services to an empty set of the referral's programs's available services
     */
    function resetServices() {
      if (vm.selectedProgram) {
        var programID = (_.has(vm.selectedProgram, 'id')) ? vm.selectedProgram.id : vm.selectedProgram;
        AltumProgramServices.query({
          where: {
            program: programID
          }
        }).$promise.then(function (altumProgramServices) {
          vm.recommendedServices = [];

          // fetch and return list of unique service categories in altum services
          vm.currentCategories = _.unique(_.map(altumProgramServices, function (altumProgramService) {
            return {
              id: altumProgramService.serviceCategory,
              name: altumProgramService.serviceCategoryName
            };
          }), 'id');

          // available services denote all program services across each retrieved altum service
          // sorting respective program services by serviceCateogry takes place in the html template
          vm.availableServices = _.map(altumProgramServices, function (altumProgramService) {
            // append each altumProgramService's altumProgramServices to the list of available prospective services
            return {
              name: altumProgramService.altumServiceName,
              altumService: altumProgramService.id,
              programService: altumProgramService.programService,
              serviceCategory: altumProgramService.serviceCategory
            };
          });
        });
      }
    }

    /**
     * isServiceRecommended
     * @description Returns bool reporting if service is recommended
     * @param {String} service
     */
    function isServiceRecommended(service) {
      return _.contains(vm.recommendedServices, service);
    }

    /**
     * toggleService
     * @description Adds/removes a programService from recommendedServices
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
     * saveServices
     * @description Saves the currently selected services to the current referral
     */
    function saveServices() {
      $q.all(_.map(vm.recommendedServices, function (service) {
        var serviceObj = new ReferralServices(service);
        return serviceObj.$save();
      }))
      .then(function(data) {
        toastr.success('Added services to referral for client: ' + vm.referral.clientcontact.displayName, 'Recommendations');
        if (vm.selectedProgram.id != vm.referral.program.id) {
          Referral.update({id: vm.referral.id, program: vm.selectedProgram});
        }
        init();
      });
    }

    /**
     * toggleNotebar
     * @description show or hide the notes panel
     */
    function toggleNotebar () {
        vm.style_notebarCollapsed = !vm.style_notebarCollapsed;
      }

  }

})();

