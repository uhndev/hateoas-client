describe('Controller: AccessManagementController Tests', function() {

  var scope, accessctrl, API, GroupService, PermissionService, UserRoles,  UserPermissions, uibModal, $httpBackend;

  beforeEach(function() {
    module('dados.access','dados.access.service','dados.user.service', 'ui.bootstrap', 'dados.constants');
  });

  beforeEach(inject(function($injector, _$controller_,  _$rootScope_,_$uibModal_, _GroupService_, _PermissionService_, _UserRoles_, _API_) {
    scope = _$rootScope_.$new();
    API = _API_;
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', API.base() + '/api/permission?model=1&populate=model&populate=role&populate=criteria&populate=user').respond(
      [{
        permission: {
          action: 'create',
          criteria:
            {
              blacklist: [
                'group'
              ],
              createdAt: '',
              id: 9,
              updatedAT: '',
              permission: 2,
              where: null
            },
          id: 9,
          model: {
            atributtes: {},
            id: 1,
            identity: 'model',
            name: 'Model',
            relation: 'role'
          },
          relation: 'role',
          role: {
            active: true,
            createdAt: '',
            displayName: 'admin',
            id: 9,
            updatedAt: '',
            user: null
          }
        }
      }
        ]
    );
    $httpBackend.when('GET', API.base() + '/api/permission?model=2&populate=model&populate=role&populate=criteria&populate=user').respond(
      [{
        permission: {
          action: 'read',
          criteria:
            {
              blacklist: [
                'group'
              ],
              createdAt: '',
              id: 9,
              updatedAT: '',
              permission: 2,
              where: null
            },
          id: 9,
          model: {
            atributtes: {},
            id: 2,
            identity: 'permission',
            name: 'Permission',
            relation: 'role'
          },
          relation: 'role',
          role: {
            active: true,
            createdAt: '',
            displayName: 'admin',
            id: 9,
            updatedAt: '',
            user: null
          }
        }
      }
      ]
    );
    $httpBackend.when('GET', API.base() + '/api/permission?populate=model&populate=role&populate=criteria&role=9').respond(
      [{
        permission: {
          action: 'read',
          criteria:
            {
              blacklist: [
                'group'
              ],
              createdAt: '',
              id: 9,
              updatedAT: '',
              permission: 2,
              where: null
            },
          id: 9,
          model: {
            atributtes: {},
            id: 3,
            identity: 'permission',
            name: 'Permission',
            relation: 'role'
          },
          relation: 'role',
          role: {
            active: true,
            createdAt: '',
            displayName: 'admin',
            id: 9,
            updatedAt: '',
            user: null
          }
        }
      }
      ]
    );
    $httpBackend.when('GET', API.base() + '/api/group/admin?populate=roles').respond(
      {
        displayName: 'admin',
        href: 'http://localhost:1337/api/group/admin',
        id: 'admin',
        level: 1,
        menu: {
        },
        rel: 'group',
        roles: [{
          active: true,
          createdAt: '2016-04-08T18:13:27.000Z',
          displayNane: 'admin',
          id: 1,
          name: 'admin',
          updatedAt: '2016-04-08T18:13:27.000Z'
        }]
      }

    );

    PermissionService = _PermissionService_;
    UserRoles = _UserRoles_;
    GroupService = _GroupService_;
    uibModal = _$uibModal_;
    accessctrl = _$controller_('AccessManagementController', {
      $uibModal: uibModal,
      GroupService: GroupService,
      PermissionService: PermissionService,
      UserRoles: UserRoles,
      UserPermissions: UserPermissions
    });
    scope.vm = accessctrl;
  }));

  describe('Basic unit tests for viewing User Permissions', function() {
    it('then should at least be defined', function() {

      expect(accessctrl).toBeDefined();
    });
  });

  describe('When a model item is selected', function() {
    it('should show role permissions for model', function() {

      var queryObj = {
        model: 1,
        populate: ['model', 'role', 'criteria', 'user']
      };

      var t = PermissionService.query(queryObj);

      PermissionService.query(queryObj).$promise.then(function() {

        expect(t[0].permission.model.identity).toBe('model');
      });
      $httpBackend.expectGET(API.base() + '/api/permission?model=1&populate=model&populate=role&populate=criteria&populate=user');
      $httpBackend.flush();

      var queryObj1 = {
        model: 2,
        populate: ['model', 'role', 'criteria', 'user']
      };

      var t1 = PermissionService.query(queryObj1);

      PermissionService.query(queryObj1).$promise.then(function() {

        expect(t1[0].permission.model.identity).toBe('permission');
      });
      $httpBackend.expectGET(API.base() + '/api/permission?model=2&populate=model&populate=role&populate=criteria&populate=user');
      $httpBackend.flush();
    });
  });

  describe('When a group item is selected', function() {
    it('should show role permissions for group', function() {

      var t2 = PermissionService.query({role:  9, populate: ['model', 'role', 'criteria']});

      var t1 = GroupService.get({id: 'admin', populate: 'roles'}, function (data) {

        PermissionService.query({role:  9, populate: ['model', 'role', 'criteria']}).$promise.then(function() {

          expect(t2[0].permission.id).toBe(9);
        });
      });

      GroupService.get({id: 'admin', populate: 'roles'}, function (data) {

        return PermissionService.query({role:  9, populate: ['model', 'role', 'criteria']});
      }).$promise.then(function() {

        expect(t1.roles[0].name).toBe('admin');
      });

      $httpBackend.expectGET(API.base() + '/api/group/admin?populate=roles');
      $httpBackend.expectGET(API.base() + '/api/permission?populate=model&populate=role&populate=criteria&role=9');
      $httpBackend.flush();
    });
  });
});
