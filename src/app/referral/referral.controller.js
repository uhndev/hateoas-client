(function () {
  'use strict';

  angular
    .module('altum.referral', [])
    .controller('ReferralController', ReferralController);

  ReferralController.$inject = ['$resource', '$location', 'API', 'HeaderService', 'ReferralService', 'toastr'];

  function ReferralController($resource, $location, API, HeaderService, Referral, toastr) {
    var vm = this;

    // bindable variables
    vm.url = API.url() + $location.path();
    vm.selectedProgram = null;
    vm.selectedSite = null;
    vm.selectedPhysician = null;

    // bindable methods
    vm.updateReferral = updateReferral;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Resource = $resource(vm.url);

      Resource.get(function (data, headers) {
        vm.allow = headers('allow');
        vm.template = data.template;
        vm.referral = angular.copy(data.items);

        vm.selectedProgram = data.items.program;
        vm.selectedSite = data.items.site;
        vm.selectedPhysician = data.items.physician;

        var clientData = _.pick(vm.referral.clientcontact, 'MRN', 'displayName', 'dateOfBirth');
        var referralData = _.pick(vm.referral, 'program', 'site', 'physician', 'referralContact', 'referralDate', 'accidentDate', 'sentDate', 'receiveDate', 'dischargeDate');

        // referral info panel
        vm.referralInfo = {
          rows: {
            'MRN': {title: 'COMMON.MODELS.CLIENT.MRN', type: 'text'},
            'displayName': {title: 'COMMON.MODELS.PERSON.NAME', type: 'text'},
            'dateOfBirth': {title: 'COMMON.MODELS.PERSON.DATE_OF_BIRTH', type: 'date'},
            'program': {title: 'Program', type: 'program'},
            'site': {title: 'Site', type: 'site'},
            'physician': {title: 'Physician', type: 'physician'},
            'referralContact': {title: 'Referral Contact', type: 'employee'},
            'referralDate': {title: 'COMMON.MODELS.REFERRAL.REFERRAL_DATE', type: 'date'},
            'accidentDate': {title: 'COMMON.MODELS.REFERRAL.ACCIDENT_DATE', type: 'date'},
            'sentDate': {title: 'COMMON.MODELS.REFERRAL.SENT_DATE', type: 'date'},
            'receiveDate': {title: 'COMMON.MODELS.REFERRAL.RECEIVE_DATE', type: 'date'},
            'dischargeDate': {title: 'COMMON.MODELS.REFERRAL.DISCHARGE_DATE', type: 'date'}
          },
          tableData: _.objToPair(_.merge(clientData, referralData))
        };

        // initialize submenu
        HeaderService.setSubmenu('client', data.links);
      });
    }

    /**
     * updateReferral
     * @description Saves program and physician selections for a selected referral
     */
    function updateReferral() {
      if (vm.selectedProgram && vm.selectedPhysician) {
        var referral = new Referral({
          program: vm.selectedProgram,
          site: vm.selectedSite,
          physician: vm.selectedPhysician
        });
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

  }

})();

