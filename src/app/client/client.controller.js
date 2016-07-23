(function () {
  'use strict';

  angular
    .module('altum.client.overview', [
      'ngResource',
      'dados.header.service'
    ])
    .controller('ClientController', ClientController);

  ClientController.$inject = ['$resource', '$location', 'API', 'HeaderService'];

  function ClientController($resource, $location, API, HeaderService) {
    var vm = this;

    // bindable variables
    vm.url = API.url() + $location.path();

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Resource = $resource(vm.url);
      Resource.get(function (data, headers) {
        vm.allow = headers('allow');
        vm.template = data.template;
        vm.client = angular.copy(data.items);

        vm.client.addressName = _.values(_.pick(data.items,
          'address1', 'address2', 'city', 'province', 'postalCode', 'region', 'country', 'latitude', 'longitude'
        )).join(' ');

        var clientData = _.pick(vm.client, 'MRN', 'displayName', 'firstName', 'middleName', 'lastName', 'addressName',
          'personComments', 'gender', 'dateOfBirth', 'homePhone', 'fax', 'otherPhone', 'homeEmail', 'language',
          'requiresInterpreter', 'familyDoctor', 'primaryEmergencyContact'
        );

        // client info panel
        vm.clientInfo = {
          rowsClient: {
            'MRN': {title: 'COMMON.MODELS.CLIENT.MRN', type: 'text'},
            'displayName': {title: 'COMMON.MODELS.PERSON.NAME', type: 'text'},
            'firstName': {title: 'COMMON.MODELS.PERSON.FIRST_NAME', type: 'text'},
            'middleName': {title: 'COMMON.MODELS.PERSON.MIDDLE_NAME', type: 'text'},
            'lastName': {title: 'COMMON.MODELS.PERSON.LAST_NAME', type: 'text'},
            'addressName': {title: 'COMMON.MODELS.PERSON.ADDRESS', type: 'text'},
            'personComments': {title: 'COMMON.MODELS.PERSON.PERSON_COMMENTS', type: 'text'},
            'gender': {title: 'COMMON.MODELS.CLIENT.GENDER', type: 'text'},
            'dateOfBirth': {title: 'COMMON.MODELS.PERSON.DATE_OF_BIRTH', type: 'date'},
            'homePhone': {title: 'COMMON.MODELS.PERSON.HOME_PHONE', type: 'integer'},
            'fax': {title: 'COMMON.MODELS.PERSON.FAX', type: 'integer'},
            'otherPhone': {title: 'COMMON.MODELS.PERSON.OTHER_PHONE', type: 'integer'},
            'homeEmail': {title: 'COMMON.MODELS.PERSON.HOME_EMAIL', type: 'text'},
            'language': {title: 'COMMON.MODELS.PERSON.LANGUAGE', type: 'text'},
            'requiresInterpreter': {title: 'COMMON.MODELS.PERSON.REQUIRES_INTERPRETER', type: 'text'},
            'familyDoctor': {title: 'COMMON.MODELS.PERSON.FAMILY_DOCTOR', type: 'physician'},
            'primaryEmergencyContact': {title: 'COMMON.MODELS.PERSON.PRIMARY_EMERGENCY_CONTACT', type: 'emergencycontact'}
          },
          tableDataClient: _.objToPair(clientData)
        };

        // initialize submenu
        HeaderService.setSubmenu('client', data.items.links);
      });
    }
  }

})();
