/**
 * @name user-editor
 * @description Angular component that abstracts the functionality for editing user information
 * @example <user-editor horizontal="true" user="user"></user-editor>
 */

(function() {
  'use strict';

  angular
    .module('dados.common.directives.userEditor', [])
    .controller('UserEditorController', UserEditorController)
    .component('userEditor', {
      bindings: {
        horizontal: '@?',
        showSaveButton: '@?',
        canGeneratePassword: '@?',
        user: '='
      },
      templateUrl: 'directives/modelEditors/userEditor/user-editor.tpl.html',
      controller: 'UserEditorController',
      controllerAs: 'user'
    });

  UserEditorController.$inject = ['UserService', 'toastr'];

  function UserEditorController(UserService, toastr) {
    var vm = this;

    // bindable variables
    vm.user = vm.user || {};
    vm.horizontal = vm.horizontal == 'true' || false;
    vm.showSaveButton = vm.showSaveButton == 'true' || false;
    vm.canGeneratePassword = vm.canGeneratePassword == 'true' || false;

    // bindable methods
    vm.updateUser = updateUser;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      if (_.isUndefined(vm.user.dob)) {
        delete vm.user.dob;
      } else {
        if (angular.isString(vm.user.dob)) {
          vm.user.dob = new Date(vm.user.dob);
        }
      }
    }

    /**
     * updateUser
     * @description Convenience function to perform PUT request to update user profile.
     */
    function updateUser() {
      var user = new UserService(vm.user);
      user.$update({id: vm.user.id})
        .then(function() {
          toastr.success('Updated user profile!', 'User Profile');
        })
        .finally(function () {
          delete vm.user.password;
        });
    }
  }

})();
