(function () {
  'use strict';
  angular
    .module('altum.client', [
      'dados.common.services.altum',
      'altum.client.register.controller'
    ])
    .config(['$stateProvider', function ($stateProvider) {

      var clientState = {
        resolve: {
          resolvedPerson: function ($resource, $stateParams, API) {
            var Person = $resource(API.url('person'), {}, {
              'query': {method: 'GET', isArray: false}
            });
            return Person.query({where: {id: 0}, limit: 1}).$promise;
          },
          resolvedClient: function (ClientService, $stateParams) {
            if (!$stateParams.id) {
              return {
                person: {
                  address: {
                    city: {}
                  },
                  familyDoctor: {
                    person: {}
                  },
                  employments: [],
                  primaryEmergencyContact: {},
                  emergencyContacts: []
                }
              };
            } else {
              return ClientService.get({id: $stateParams.id}).$promise;
            }
          }
        },
        templateUrl: 'clientregister/clientregister.tpl.html',
        controller: 'ClientRegisterController',
        controllerAs: 'CR'
      };

      $stateProvider
        .state('newClient', _.merge({
          url: '/newClient',
          data: {
            pageTitle: 'Add Client',
            fullUrl: '/newClient'
          }}, clientState)
        )
        .state('editClient', _.merge({
          url: '/editClient/:id',
          data: {
            pageTitle: 'Edit Client',
            fullUrl: '\/editClient\/[0-9]+'
          }}, clientState)
        );
    }]);
})();

