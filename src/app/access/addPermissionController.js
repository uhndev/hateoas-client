(function() {
  'use strict';

  angular
    .module('dados.access')
    .controller('AddPermissionController', AddPermissionController);

  AddPermissionController.$inject = [
    '$uibModalInstance', 'PermissionService', 'ModelService', 'toastr', 'role', 'user'
  ];

  function AddPermissionController($uibModalInstance, Permission, Model, toastr, role, user) {
    var vm = this;

    // bindable variables
    vm.newPermission = {
      criteria:[],
      role: role,
      relation: 'role'
    };
    vm.models = Model.query({limit: -1});
    vm.role = role;
    vm.user = user;

    // bindable methods
    vm.addPermission = addPermission;
    vm.cancel = cancel;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      if (user) { // if user passed in, create permission as user specific permission
        vm.newPermission.relation = 'user';
        vm.newPermission.user = user.id;
      }
    }

    /**
     * addPermission
     * @description Click handler for adding a permission to a role or user. Uses the
     *              permission-manager directive to handle criteria
     */
    function addPermission() {
      Permission.save(vm.newPermission, function (data) {
        if (user) {
          toastr.success('Added permission for user ' + user.displayName + '!', 'Access Management');
          $uibModalInstance.close('user');
        } else {
          toastr.success('Added permission to role ' + role.name + '!', 'Access Management');
          $uibModalInstance.close('role');
        }
        vm.newPermission = {};
      });
    }

    /**
     * cancel
     * @description Closes the modal window.
     */
    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

  }
})();
