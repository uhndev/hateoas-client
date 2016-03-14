(function () {
    'use strict';
    angular.module('altum.client.register', [
            'dados.common.services.altum',
            'altum.client.register.controller'
            // 'altum.client.register.factory'
        ])
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider
                .state('newClient', {
                    //  authenticate: true,
                    url: '/newClient',
                    data: {pageTitle: 'Add Client'},
                    resolve: {
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
                    data: {pageTitle: 'Edit Client'},
                    resolve: {
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

