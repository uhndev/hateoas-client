(function () {
  'use strict';

  angular
    .module('dados.user.service', [
      'dados.constants',
      'dados.common.services.resource'
    ])
    .service('UserService', UserService)
    .service('ProviderService', ProviderService)
    .service('StudyUserService', StudyUserService)
    .service('UserRoles', UserRoles)
    .service('UserPermissions', UserPermissions)
    .service('UserEnrollment', UserEnrollment);

  [UserService, ProviderService, UserPermissions, UserEnrollment].map(function (service) {
    service.$inject = ['ResourceFactory', 'API'];
  });

  StudyUserService.$inject = ['$resource', 'API'];
  UserRoles.$inject = ['$resource', 'API'];

  function UserService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('user'));
  }

  function ProviderService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('provider'));
  }

  function StudyUserService($resource, API) {
    return $resource(
      API.url() + '/study/:studyID/users',
      {
        studyID: '@studyID'
      },
      {
        'query': {
          method: 'GET',
          isArray: true,
          transformResponse: _.transformHateoas
        }
      }
    );
  }

  function UserRoles($resource, API) {
    return $resource(
      API.url() + '/user/:userID/roles/:roleID',
      {
        userID: '@userID',
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

  function UserPermissions(ResourceFactory, API) {
    return ResourceFactory.create(API.url('user') + '/findPermissions');
  }

  function UserEnrollment(ResourceFactory, API) {
    return ResourceFactory.create(API.url('userenrollment'));
  }

})();
