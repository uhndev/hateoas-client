(function () {
  'use strict';

  angular
    .module('dados.access', [])
    .controller('AccessManagementController', AccessManagementController);

  AccessManagementController.$inject = ['$uibModal', 'GroupService', 'PermissionService', 'UserRoles', 'UserPermissions'];

  function AccessManagementController($uibModal, Group, Permission, UserRoles, UserPermissions) {
    var vm = this;

    // bindable variables
    vm.current = 'group';
    vm.currentIndex = 0;
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
    vm.addUserToRole = addUserToRole;
    vm.openAddPermission = openAddPermission;

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
        populate: ['model', 'role', 'criteria', 'user'],
        limit: 1000
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
        vm.selectedNewRole = null;
        vm.detailInfo = UserPermissions.get({id: vm[vm.current].selected.id});
      }
    }

    /**
     * addUserToRole
     * @description Click handler for adding a user to a given role selected from select-loader on user tab.
     */
    function addUserToRole() {
      if (vm.selectedNewRole) {
        var userRole = new UserRoles();
        userRole.userID = vm.user.selected.id;
        userRole.roleID = vm.selectedNewRole;
        userRole.$save().then(function () {
          vm.selectedNewRole = null;
          vm.detailInfo = UserPermissions.get({id: vm.user.selected.id});
        });
      }
    }

    /**
     * openAddPermission
     * @description Click handler for opening the add permissions to role modal window.
     */
    function openAddPermission() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'access/addPermissionModal.tpl.html',
        controller: 'AddPermissionController',
        controllerAs: 'ap',
        bindToController: true,
        size: 'lg',
        resolve: {
          role: function() {
            return (vm.current === 'role') ? vm.role.selected : null;
          },
          user: function() {
            return (vm.current === 'user') ? vm.user.selected : null;
          }
        }
      });

      // reloads appropriate data based on what type of permission was created.
      modalInstance.result.then(function (type) {
        switch (type) {
          case 'user':
            vm.detailInfo.permissions = fetchPermissionsBy('user', vm[vm.current].selected.id);
            break;
          case 'role':
            vm.detailInfo = fetchPermissionsBy('role', vm[vm.current].selected.id);
            break;
        }
      });
    }

  }

})();
