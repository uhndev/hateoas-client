(function () {
  'use strict';

  angular
    .module('dados.access.service', [
      'dados.constants',
      'dados.common.services.resource'
    ])
    .service('GroupService', GroupService)
    .service('RoleService', RoleService)
    .service('PermissionService', PermissionService)
    .service('ModelService', ModelService);

  [GroupService, RoleService, PermissionService, ModelService].map(function (service) {
    service.$inject = ['ResourceFactory', 'API'];
  });

  function GroupService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('group'));
  }

  function RoleService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('role'));
  }

  function PermissionService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('permission'));
  }

  function ModelService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('model'));
  }
})();
