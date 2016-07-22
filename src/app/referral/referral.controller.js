(function () {
  'use strict';

  angular
    .module('altum.referral.controller', [
      'ngMaterial',
      'ngResource',
      'dados.header.service',
      'dados.common.config'
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
        var clientData = _.pick(vm.referral.clientcontact, 'MRN', 'gender', 'displayName', 'dateOfBirth','country','city','postalCode', 'homeEmail','homePhone');
        var referralData = _.pick(vm.referral, 'createdAt', 'program', 'site', 'physician', 'staff', 'referralContact',
          'claimNumber', 'policyNumber', 'referralDate', 'clinicDate', 'accidentDate', 'sentDate', 'receiveDate', 'dischargeDate', 'statusName');

        //email fields for sending email from note directive
        vm.emailInfo = {
          template: 'referral',
          data: {
            claim: vm.referral.claimNumber,
            client: vm.referral.clientcontact.displayName,
            url: encodeURI($location.absUrl())
          },
          options: {
            subject: 'Altum CMS Communication'
          }
        };

        // referral info panel
        vm.referralInfo = {
          rowsReferral: {
            'createdAt': {title: 'COMMON.MODELS.REFERRAL.CREATED_AT', type:'date'},
            'program': {title: 'COMMON.MODELS.REFERRAL.PROGRAM', type: 'program'},
            'site': {title: 'COMMON.MODELS.REFERRAL.SITE', type: 'site'},
            'physician': {title: 'COMMON.MODELS.REFERRAL.PHYSICIAN', type: 'physician'},
            'staff': {title: 'COMMON.MODELS.REFERRAL.STAFF', type: 'staff'},
            'referralContact': {title: 'COMMON.MODELS.REFERRAL.REFERRAL_CONTACT', type: 'employee'},
            'claimNumber': {title: 'COMMON.MODELS.REFERRAL.CLAIM_NUMBER', type: 'text'},
            'policyNumber': {title: 'COMMON.MODELS.REFERRAL.POLICY_NUMBER', type: 'text'},
            'referralDate': {title: 'COMMON.MODELS.REFERRAL.REFERRAL_DATE', type: 'date'},
            'clinicDate': {title: 'COMMON.MODELS.REFERRAL.CLINIC_DATE', type: 'date'},
            'accidentDate': {title: 'COMMON.MODELS.REFERRAL.ACCIDENT_DATE', type: 'date'},
            'sentDate': {title: 'COMMON.MODELS.REFERRAL.SENT_DATE', type: 'date'},
            'receiveDate': {title: 'COMMON.MODELS.REFERRAL.RECEIVE_DATE', type: 'date'},
            'dischargeDate': {title: 'COMMON.MODELS.REFERRAL.DISCHARGE_DATE', type: 'date'},
            'statusName': {title: 'COMMON.MODELS.REFERRAL.STATUS', type: 'text'}
          },
          rowsClient: {
            'MRN': {title: 'COMMON.MODELS.CLIENT.MRN', type: 'text'},
            'gender': {title: 'COMMON.MODELS.CLIENT.GENDER', type: 'text'},
            'displayName': {title: 'COMMON.MODELS.PERSON.NAME', type: 'text'},
            'dateOfBirth': {title: 'COMMON.MODELS.PERSON.DATE_OF_BIRTH', type: 'date'},
            'country': {title: 'COMMON.MODELS.CLIENT.COUNTRY', type: 'text'},
            'city': {title: 'COMMON.MODELS.CLIENT.CITY', type: 'text'},
            'postalCode': {title:'COMMON.MODELS.CLIENT.POSTAL_CODE', type:'text'},
            'homeEmail': {title: 'COMMON.MODELS.CLIENT.EMAIL', type: 'text'},
            'homePhone': {title: 'COMMON.MODELS.CLIENT.PHONE', type: 'integer'},
          },
          referralContacts: _.map(vm.referral.referralContacts, function (contact) {
            return {
              rows: {
                'displayName': {title: 'COMMON.MODELS.EMPLOYEE.NAME', type: 'text'},
                'workPhone': {title: 'COMMON.MODELS.EMPLOYEE.WORK_PHONE', type: 'text'},
                'workEmail': {title: 'COMMON.MODELS.EMPLOYEE.WORK_EMAIL', type: 'text'},
                'occupation': {title: 'COMMON.MODELS.EMPLOYEE.OCCUPATION', type: 'text'},
                'occupationType': {title: 'COMMON.MODELS.EMPLOYEE.OCCUPATION_TYPE', type: 'text'},
                'occupationSector': {title: 'COMMON.MODELS.EMPLOYEE.OCCUPATION_SECTOR', type: 'text'}
              },
              tableData: _.objToPair(_.pick(contact, 'displayName', 'workPhone', 'workEmail', 'occupation', 'occupationType', 'occupationSector'))
            };
          }),
          tableDataReferral: _.objToPair(referralData),
          tableDataClient: _.objToPair(clientData)
        };

        // initialize submenu
        HeaderService.setSubmenu('referral', data.links);
      });
    }
  }

})();
