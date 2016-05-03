describe('Controller: Permission Manager Tests', function() {

  var scope, permissionctrl, PermissionService, toastr, $httpBackend;

  beforeEach(function() {
    module('dados.access', 'dados.access.service', 'toastr');
  });

  beforeEach(inject(function($injector, _$controller_,  _$rootScope_, _toastr_, _PermissionService_) {

    $httpBackend = $injector.get('$httpBackend');

    var dummy =
    {
      permission: {
        action: 'create',
        criteria:
        {
          blacklist: [
            'group'
          ],
          createdAt: '',
          id: 15,
          updatedAT: '',
          permission: 2,
          where: null,
        },
        id: 37,
        model: {
          atributtes: {},
          id: 1,
          identity: 'group',
          name: 'Group',
          relation: 'role'
        },
        relation: 'role',
        role: {
          active: true,
          createdAt: '',
          displayName: 'admin',
          id: 9,
          updatedAt: '',
          user: 'admin'
        }
      }
    };

    $httpBackend.when('PUT', 'https://localhost:1337/api/permission/37').respond(200);
    $httpBackend.when('DELETE', 'https://localhost:1337/api/permission/37').respond(200);
    scope = _$rootScope_.$new();
    PermissionService = _PermissionService_;
    toastr = _toastr_;
    permissionctrl = _$controller_('PermissionController', {PermissionService: PermissionService, toastr: toastr}, dummy);
    scope.vm = permissionctrl;
  }));

  describe('Basic unit tests for managing user permissions', function() {
    it('then should at least be defined', function() {

      expect(permissionctrl).toBeDefined();
    });
  });

  describe('When changes are made to permissions', function() {
    it('then should revert permission to initial state', function() {

      permissionctrl.permission.criteria.where = {
        name: 'TEST'
      };

      expect(permissionctrl.permission.criteria.where.name).toBe('TEST');
      permissionctrl.revertPermission();
      expect(permissionctrl.permission.criteria.where).toBe(null);
    });

    it('then should add changes and update permission', function() {

      permissionctrl.permission.criteria.where = {
        name: 'TEST'
      };

      expect(permissionctrl.permission.criteria.where.name).toBe('TEST');
      permissionctrl.updatePermission();
      $httpBackend.expectPUT('https://localhost:1337/api/permission/37');
      $httpBackend.flush();
    });
  });

  describe('When add name to Blacklist', function() {
    it('then should have added name to Blacklist', function() {

      var att =
      {
        attribute:{
          name: 'name'
        }
      };

      permissionctrl.addToBlacklist(permissionctrl.permission.criteria, att);
      expect(permissionctrl.permission.criteria.blacklist.length).toBe(2);
    });
  });

  describe('When revoke is called', function() {
    it('then should, popup confirm window and delete permission', function() {

      spyOn(window, 'confirm').and.callFake(function () {
        return true;
      });

      scope.vm.onRemove = function onRemove() {
        return true;
      };

      permissionctrl.revokePermission();
      $httpBackend.expectDELETE('https://localhost:1337/api/permission/37');
      $httpBackend.flush();
    });
  });
});
