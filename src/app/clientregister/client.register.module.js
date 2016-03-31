(function () {
  'use strict';
  angular.module('altum.client', [
          'dados.common.services.altum',
          'altum.client.register.controller'
          // 'altum.client.register.factory'
      ])
        .config(['$stateProvider', function ($stateProvider) {

          $stateProvider
                .state('newClient', {
                  //  authenticate: true,
                  url: '/newClient',
                  data: {
                    pageTitle: 'Add Client',
                    fullUrl: '/newClient'
                  },
                  resolve: {
                    resolvedPerson: function($resource, $stateParams, API) {
                      var person = $resource(API.url('person'), {}, {
                        'query' : {method: 'GET', isArray: false}
                      });
                      return person.query({where: {id: 0}, limit: 1}).$promise;
                    },
                    resolvedClient: function () {
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
                    }
                  },
                  templateUrl: 'clientregister/clientregister.tpl.html',
                  controller: 'ClientRegisterController',
                  controllerAs: 'CR'
                })

                .state('editClient', {
                  //  authenticate: true,
                  url: '/editClient/:id',
                  data: {
                    pageTitle: 'Edit Client',
                    fullUrl: '\/editClient\/[0-9]+'
                  },
                  resolve: {
                    resolvedPerson: function($resource, $stateParams, API) {
                      var person = $resource(API.url('person'), {}, {
                        'query' : {method: 'GET', isArray: false}
                      });
                      return person.query({where: {id: 0}, limit: 1}).$promise;
                    },
                    resolvedClient: function (ClientService, $stateParams) {
                      return ClientService.get({id: $stateParams.id}).$promise;
                    }
                  },
                  templateUrl: 'clientregister/clientregister.tpl.html',
                  controller: 'ClientRegisterController',
                  controllerAs: 'CR'
                });
        }]);
})();

