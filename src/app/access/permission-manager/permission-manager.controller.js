(function () {
  'use strict';

  angular
    .module('dados.access')
    .controller('PermissionController', PermissionController);

  PermissionController.$inject = ['PermissionService', 'toastr'];

  function PermissionController(Permission, toastr) {
    var vm = this;

    // bindable variables
    vm.permission = vm.permission || null;

    // bindable methods
    vm.revokePermission = revokePermission;
    vm.toggleCollapse = toggleCollapse;

    ///////////////////////////////////////////////////////////////////////////

    function revokePermission() {
      Permission.remove({id: vm.permission.id}, function (data) {
        vm.onRemove();
        toastr.success('Permission successfully revoked!', 'Access Management');
      });
    }

    function toggleCollapse() {
      vm.isCollapsed = !vm.isCollapsed;
    }
  }

})();
