(function () {
  'use strict';

  angular
    .module('dados.access.service', [
      'ngResource',
      'dados.constants',
      'dados.common.services.resource'
    ])
    .service('GroupService', GroupService)
    .service('GroupRolesService', GroupRolesService)
    .service('RoleService', RoleService)
    .service('PermissionService', PermissionService)
    .service('ModelService', ModelService);

  [GroupService, RoleService, PermissionService, ModelService].map(function (service) {
    service.$inject = ['ResourceFactory', 'API'];
  });

  GroupRolesService.$inject = ['$resource', 'API'];

  function GroupService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('group'));
  }

  function GroupRolesService($resource, API) {
    return $resource(
      API.url() + '/group/:groupID/roles/:roleID',
      {
        groupID: '@groupID',
        roleID: '@roleID'
      },
      {
        'save' : {
          method: 'POST',
          isArray: false,
          transformResponse: _.transformHateoas
        },
        'delete' : {
          method: 'DELETE',
          isArray: false,
          transformResponse: _.transformHateoas
        }
      }
    );
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
