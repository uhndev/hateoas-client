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
    vm.addToBlacklist = addToBlacklist;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      // if no criteria set, initialize with dummy data
      if (vm.permission.criteria.length === 0) {
        vm.permission.criteria.push({
          where: {},
          blacklist: []
        });
      }

      // save backup of existing permission in case
      angular.copy(vm.permission, backup);

      // strip out collection attributes from model.attributes
      _.each(vm.permission.model.attributes, function (value, key) {
        if (!_.has(value, 'collection')) {
          var template = {
            name: key,
            prompt: _.startCase(key),
            type: ((key === 'id') ? vm.permission.model.identity : value.type),
            value: ''
          };
          if (_.has(value, 'model')) {
            template.type = value.model;
          }

          vm.template.data.push(template);
        }
      });
    }

    /**
     * revertPermission
     * @description Click handler for reverting back to original permission object
     */
    function revertPermission() {
      angular.copy(backup, vm.permission);
    }

    /**
     * updatePermission
     * @description Click handler for saving updates to permission criteria only
     */
    function updatePermission() {
      Permission.update({
        id: vm.permission.id,
        criteria: vm.permission.criteria
      }, function (data) {
        toastr.success('Permission successfully updated!', 'Access Management');
      });
    }

    /**
     * revokePermission
     * @description Click handler for deleting/revoking a permission record
     */
    function revokePermission() {
      if (confirm('Are you sure you wish to revoke this permission?')) {
        Permission.remove({id: vm.permission.id}, function (data) {
          vm.onRemove();
          toastr.success('Permission successfully revoked!', 'Access Management');
        });
      }
    }

    /**
     * addToBlacklist
     * @description Click handler for adding an attribute to a permission criteria blacklist.
     * @param criteria
     * @param attribute
     */
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
