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
          resolvedPerson: function (TemplateService) {
            return TemplateService.fetchTemplate('person');
          },
          resolvedClient: function (ClientService, $stateParams) {
            if (!$stateParams.id) {
              return {
                person: {
                  employments: []
                }
              };
            } else {
              return ClientService.get({id: $stateParams.id}).$promise;
            }
          }
        },
        templateUrl: 'clientregister/clientregister.tpl.html',
        controller: 'ClientRegisterController',
        controllerAs: 'clientRegister'
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
