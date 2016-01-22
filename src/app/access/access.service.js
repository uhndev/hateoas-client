(function() {
  'use strict';

  angular
  .module('dados.access.service', [
        'dados.constants',
        'dados.common.services.resource'
      ])
      .service('RoleService', RoleService)
  .service('GroupService', GroupService)
  .service('ModelService', ModelService);

  [RoleService, GroupService, ModelService].map(function (service) {
    service.$inject = ['ResourceFactory', 'API'];
  });

  function RoleService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('role'));
  }

  function GroupService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('group'));
  }

  function ModelService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('model'));
  }
})();
