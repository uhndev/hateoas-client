(function () {
  'use strict';

  angular
    .module('dados.access')
    .controller('PermissionController', PermissionController);

  PermissionController.$inject = ['PermissionService', 'toastr'];

  function PermissionController(Permission, toastr) {
    var vm = this;
    var backup = {};

    // bindable variables
    vm.permission = vm.permission || null;
    vm.template = {data:[]};
    vm.modelTemplates = [];

    // bindable methods
    vm.revertPermission = revertPermission;
    vm.updatePermission = updatePermission;
    vm.revokePermission = revokePermission;
    vm.toggleCollapse = toggleCollapse;
    vm.addToBlacklist = addToBlacklist;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      angular.copy(vm.permission, backup);
      // strip out collection attributes from model.attributes
      _.each(vm.permission.model.attributes, function (value, key) {
        if (!_.has(value, 'collection')) {
          vm.template.data.push({
            name: key,
            prompt: _.startCase(key),
            type: ((_.has(value, 'model') || key === 'id') ? 'integer' : value.type),
            value: ''
          });
        }
      });
    }

    function revertPermission() {
      angular.copy(backup, vm.permission);
    }

    function updatePermission() {
      Permission.update({
        id: vm.permission.id,
        criteria: vm.permission.criteria
      }, function (data) {
        toastr.success('Permission successfully updated!', 'Access Management');
      });
    }

    function revokePermission() {
      if (confirm('Are you sure you wish to revoke this permission?')) {
        Permission.remove({id: vm.permission.id}, function (data) {
          vm.onRemove();
          toastr.success('Permission successfully revoked!', 'Access Management');
        });
      }
    }

    function toggleCollapse() {
      vm.isCollapsed = !vm.isCollapsed;
    }

    function addToBlacklist(criteria, attribute) {
      if (_.isNull(criteria.blacklist)) {
        criteria.blacklist = [];
        criteria.blacklist.push(attribute.name);
      } else {
        criteria.blacklist.push(attribute.name);
      }
    }
  }

})();
