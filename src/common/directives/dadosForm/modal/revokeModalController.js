(function() {
  'use strict';

  angular
    .module('dados.common.directives.dadosForm.revokeModal.controller', [
      'ui.bootstrap'
    ])
    .controller('RevokeModalController', RevokeModalController);

  RevokeModalController.$inject = [
    '$uibModalInstance', 'toastr'
  ];

  function RevokeModalController($uibModalInstance, toastr, centreHref) {
    var vm = this;
    // bindable variables
    vm.reason = '';
    // bindable methods
    vm.revoke = revoke;
    vm.cancel = cancel;

    ///////////////////////////////////////////////////////////////////////////

    function revoke() {
      toastr.success('The form was unsigned!', 'DADOS Form');
      $uibModalInstance.close(vm.reason);
    }

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

  }
})();
