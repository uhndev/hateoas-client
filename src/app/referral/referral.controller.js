(function () {
  'use strict';

  angular
    .module('altum.referral.controller', [
      'ngMaterial',
      'ngResource',
      'dados.header.service'
    ])
    .controller('ReferralController', ReferralController);

  ReferralController.$inject = ['$resource', '$location', 'API', 'HeaderService'];

  function ReferralController($resource, $location, API, HeaderService) {
    var vm = this;
    var ReferralServices;

    // bindable variables
    vm.url = API.url() + $location.path();

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Resource = $resource(vm.url);
      ReferralServices = $resource(vm.url + '/services');

      Resource.get(function (data, headers) {
        vm.allow = headers('allow');
        vm.template = data.template;
        vm.referral = angular.copy(data.items);

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
  }

})();
