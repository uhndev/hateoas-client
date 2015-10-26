(function() {
  'use strict';
  angular
    .module('dados.access', [
      'toastr',
      'dados.access.service',
      'dados.user.service'
    ])
    .controller('AccessController', AccessController);

  AccessController.$inject = ['toastr', 'GroupService', 'ModelService', 'UserService', 'UserRoles'];

  function AccessController(toastr, Group, Model, User, UserRoles) {
    var vm = this;

    // bindable variables
    vm.allow = '';
    vm.template = {};
    vm.resource = {};
    vm.selected = null;

    vm.actions = ['create', 'read', 'update', 'delete'];
    vm.groups = [];
    vm.models = [];
    // modex x crud list of all possible roles
    vm.masterRoles = [];
    // proposed list of access changes
    vm.access = [];
    // current user or group access view
    vm.currentView = 'user';
    vm.viewName = '';

    // bindable methods
    vm.select = select;
    vm.toggleAccessType = toggleAccessType;
    vm.isRoleSet = isRoleSet;
    vm.addToAccess = addToAccess;
    vm.removeAccess = removeAccess;
    vm.updateRole = updateRole;
    vm.saveChanges = saveChanges;

    init();

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Private Methods
     */

    /**
     * [init]
     * Private initialization call when controller is loaded.
     */
    function init() {
      // load groups
      vm.groups = Group.query();
      // load models
      Model.query(function (data) {
        vm.models = _.pluck(data, 'name');
        vm.models.push('UserOwner');
        _.each(vm.actions, function (action) {
          _.each(vm.models, function (model) {
            vm.masterRoles.push(action + model);
          });
        });

        loadResource(vm.currentView);
      });
    }

    /**
     * [loadResource]
     * Depending on user/group view, load different resource to manage
     * @param  {String} view
     */
    function loadResource(view) {
      var Resource = (view === 'user') ? User : Group;
      Resource.query(function(data, headers) {
        vm.resource.items = angular.copy(data);
      });
    }

    function loadView(item) {
      if (vm.currentView === 'user') {
        vm.viewName = [item.prefix, item.firstname, item.lastname].join(' ');
      } else {
        vm.viewName = item.name;
      }

      if (!_.isUndefined(_.find(item.roles, { name: 'admin' }))) {
        vm.access = vm.masterRoles;
      } else {
        vm.access = _.pluck(item.roles, 'name');
      }
    }

    function clearSelections() {
      vm.access = [];
      vm.selected = null;
    }

    /*****************************
     *  Public Bindable Methods  *
     *****************************/

    /**
     * [select]
     * Selects a user or group for access management
     * @param  {Object} item
     * @return {null}
     */
    function select(item) {
      vm.selected = (vm.selected === item ? null : item);
      if (vm.selected) {
        loadView(vm.selected);
      } else {
        clearSelections();
      }
    }

    /**
     * [toggleAccessType]
     * Toggles between user access management and group
     * @return {null}
     */
    function toggleAccessType() {
      // clear current selections
      clearSelections();
      loadResource(vm.currentView);
    }

    /**
     * [isRoleSet]
     * Applied to each cell of access matrix to determine if role is selected
     * @param  {String}  action
     * @param  {String}  model
     * @return {Boolean}
     */
    function isRoleSet(action, model) {
      var role = action.toString() + model.toString();
      return _.contains(vm.access, role);
    }

    /**
     * [addToAccess]
     * Selecting checkbox cell in access matrix should add role to user/group's permissions
     * @param {String} action
     * @param {Sting} model
     */
    function addToAccess(action, model) {
      var findRole = action.toString() + model.toString();
      if (_.contains(vm.access, findRole)) {
        vm.access = _.without(vm.access, findRole);
      } else {
        vm.access.push(findRole);
      }
    }

    /**
     * [removeAccess]
     * Selecting badge on left panel should remove specific permission
     * from list of proposed access changes
     * @param  {String} permission
     * @return {null}
     */
    function removeAccess(permission) {
      vm.access = _.without(vm.access, permission);
    }

    /**
     * [updateRole]
     * Changing dropdown value should update user's permissions to
     * one of the group default roles
     */
    function updateRole() {
      var user = new UserRoles({
        'updateGroup': vm.selected.group
      });
      user.$update({ id: vm.selected.id })
      .then(function(user) {
        clearSelections();
        loadResource(vm.currentView);
        toastr.success('Updated user group!', 'Access');
      });
    }

    /**
     * [saveChanges]
     * Based on values added/removed from access matrix, send proposed array
     * of access changes to update user/group roles
     */
    function saveChanges() {
      var Resource = (vm.currentView === 'user') ? UserRoles : Group;
      var resource = new Resource({
        'roles': vm.access
      });
      resource.$update({ id: vm.selected.id })
      .then(function(resource) {
        clearSelections();
        loadResource(vm.currentView);
        toastr.success('Updated access!', 'Access');
      });
    }
  }

})();
