(function () {
  'use strict';

  angular
    .module('dados.access', [])
    .controller('AccessManagementController', AccessManagementController);

  AccessManagementController.$inject = ['API', 'GroupService', 'PermissionService', 'UserService'];

  function AccessManagementController(API, Group, Permission, User) {
    var vm = this;

    // bindable variables
    vm.current = 'group';
    _.each(['group', 'model', 'role', 'user'], function (tab, idx) {
      vm[tab] = {
        index: idx,
        selected: null,
        query: {},
        resource: {}
      };
    });

    // each tab includes a fetchDetailInfo function to be called when selecting a row from a table.
    vm.tabs = [
      {
        heading: 'APP.ACCESSMANAGEMENT.TABS.BY_GROUP',
        url: 'group',
        fetchDetailInfo: fetchGroupRoles,
        onResourceLoaded: function(data) {
          if (data) {
            data.template.data = _.reject(data.template.data, {name: 'menu'});
            return data;
          }
          return data;
        }
      },
      {
        heading: 'APP.ACCESSMANAGEMENT.TABS.BY_MODEL',
        url: 'model',
        fetchDetailInfo: fetchModelPermissions,
        onResourceLoaded: function(data) {
          if (data) {
            data.template.data = _.reject(data.template.data, {name: 'attributes'});
            return data;
          }
          return data;
        }
      },
      {
        heading: 'APP.ACCESSMANAGEMENT.TABS.BY_ROLE',
        url: 'role',
        fetchDetailInfo: fetchRolePermissions,
        onResourceLoaded: function(data) {
          return data;
        }
      },
      {
        heading: 'APP.ACCESSMANAGEMENT.TABS.BY_USER',
        url: 'user',
        fetchDetailInfo: fetchUserRolePermissions,
        onResourceLoaded: function(data) {
          if (data) {
            data.template.data = [
              {
                'name': 'displayName',
                'type': 'string',
                'prompt': 'COMMON.MODELS.USER.DISPLAY_NAME',
                'value': ''
              },
              {
                'name': 'username',
                'type': 'string',
                'prompt': 'COMMON.MODELS.USER.USERNAME',
                'value': ''
              }
            ];
            return data;
          }
          return data;
        }
      }
    ];

    // bindable methods
    vm.selectTab = selectTab;
    vm.removeElement = removeElement;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Public Methods
     */

    /**
     * selectTab
     * @description Convenience method for selecting a tab
     * @param tab
     */
    function selectTab(tab) {
      vm.current = tab.url;
      vm.detailInfo = null;
      vm.currentIndex = vm[tab.url].index;
    }

    /**
     * removeElement
     * @description Convenience function for removing an element from an array after deletion
     * @param array
     * @param item
     */
    function removeElement(array, item) {
      var index = array.indexOf(item);
      if (index > -1) {
        array.splice(index, 1);
      }
    }

    /**
     * Private Methods
     */

    /**
     * select
     * @description Click handler for selecting a row from the currently available table
     * @param item
     */
    function select(item) {
      vm[vm.current].selected = (vm[vm.current].selected === item ? null : item);
      if (_.isNull(vm[vm.current].selected)) {
        vm.detailInfo = null;
      }
      return !_.isNull(vm[vm.current].selected);
    }

    /**
     * fetchPermissionsBy
     * @description Utility function for querying the Permissions table for a given criteria
     * @param model
     */
    function fetchPermissionsBy(model, id) {
      var queryObj = {
        populate: ['model', 'role', 'criteria']
      };
      queryObj[model] = id;
      return Permission.query(queryObj);
    }

    /**
     * fetchGroupRoles
     * @description If on the group tab, selecting a row should display the list of roles associated
     * @param item
     */
    function fetchGroupRoles(item) {
      if (select(item)) {
        Group.get({id: vm[vm.current].selected.id, populate: 'roles'}, function (data) {
          vm.detailInfo = Permission.query({role: _.pluck(data.roles, 'id'), populate: ['model', 'role', 'criteria']});
        });
      }
    }

    /**
     * fetchModelPermissions
     * @description If on the model tab, selecting a row should display the list of permissions for the model
     * @param item
     */
    function fetchModelPermissions(item) {
      if (select(item)) {
        vm.detailInfo = fetchPermissionsBy('model', vm[vm.current].selected.id);
      }
    }

    /**
     * fetchRolePermissions
     * @description If on the role tab, selecting a row should display the list of permissions for the role
     * @param item
     */
    function fetchRolePermissions(item) {
      if (select(item)) {
        vm.detailInfo = fetchPermissionsBy('role', vm[vm.current].selected.id);
      }
    }

    /**
     * fetchUserRolePermissions
     * @description If on the user tab, selecting a row should display the list of permissions/roles for the user
     * @param item
     */
    function fetchUserRolePermissions(item) {
      if (select(item)) {
        vm.detailInfo = {};
        vm.detailInfo.permissions = fetchPermissionsBy('user', vm[vm.current].selected.id);
        User.get({id: vm[vm.current].selected.id, populate: ['roles', 'permissions']}, function (data) {
          fetchPermissionsBy('role', _.pluck(data.roles, 'id')).$promise.then(function (permissions) {
            vm.detailInfo.roles = _.map(permissions, function (permission) {
              permission.roleName = permission.role.name;
              return permission;
            });
          });
        });
      }
    }

  }

})();
