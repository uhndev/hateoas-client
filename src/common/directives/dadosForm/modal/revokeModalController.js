/**
 * @name RevokeModalController
 * @description Controller for simple modal instance that drives form revoke process.
                Returns revoke reason.
 */

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

    /**
     * revoke
     * @description Proceeds with revoke, returns reason to parent controller
     */
    function revoke() {
      toastr.success('The form was unsigned!', 'DADOS Form');
      $uibModalInstance.close(vm.reason);
    }

    /**
     * cancel
     * @description Cancels the process, closes modal window
     */
    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

  }
})();
