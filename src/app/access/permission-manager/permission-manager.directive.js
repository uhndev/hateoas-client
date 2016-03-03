(function () {
  'use strict';

  angular
    .module('dados.access')
    .component('permissionManager', {
      transclude: true,
      bindings: {
        permission: '=',
        onRemove: '&'
      },
      templateUrl: 'access/permission-manager/permission-manager.tpl.html',
      controller: 'PermissionController',
      controllerAs: 'pm'
    });
})();
