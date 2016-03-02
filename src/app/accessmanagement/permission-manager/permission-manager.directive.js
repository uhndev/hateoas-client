(function () {
  'use strict';

  angular
    .module('dados.accessmanagement')
    .component('permissionManager', {
      transclude: true,
      bindings: {
        permission: '='
      },
      templateUrl: 'accessmanagement/permission-manager/permission-manager.tpl.html',
      controller: 'PermissionController',
      controllerAs: 'pm'
    });
})();
