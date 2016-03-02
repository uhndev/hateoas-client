(function () {
  'use strict';

  angular
    .module('dados.accessmanagement')
    .controller('PermissionController', PermissionController);

  PermissionController.$inject = [];

  function PermissionController() {
    var vm = this;

    // bindable variables
    vm.permission = vm.permission || null;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
    }
  }

})();
