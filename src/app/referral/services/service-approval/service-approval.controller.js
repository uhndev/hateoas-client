(function () {
  'use strict';

  angular
    .module('altum.referral.serviceApproval.controller', [
      'ngResource',
      'ngMaterial'
    ])
    .controller('ServiceApprovalController', ServiceApprovalController);

  ServiceApprovalController.$inject = ['$resource', 'AltumAPIService', 'API', '$uibModal', 'toastr'];

  function ServiceApprovalController($resource, AltumAPI, API, $uibModal, toastr) {
    var vm = this;
    var ServiceApproval = $resource(API.url() + '/service/' + vm.service.id + '/approvals');

    // bindable variables
    vm.service = vm.service || {};
    vm.statuses = vm.statuses || {};
    vm.approvalPopover = {
      templateUrl: 'referral/services/service-approval/service-approval-detail.tpl.html',
      title: 'Approval History'
    };

    // bindable methods
    vm.updateApprovalStatus = updateApprovalStatus;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      // get dictionary of statuses
      vm.statuses = _.indexBy(vm.statuses, 'id');

      // check if passed in service object with id without populated approvals, then fetch from server
      if (!vm.service.approvals) {
        AltumAPI.Service.get({id: vm.service.id, populate: ['currentApproval', 'approvals']}, function (data) {
          if (data.approvals.length > 0) {
            vm.service.previousStatus = data.currentApproval.status;
            vm.service.currentStatus = data.currentApproval.status;
            vm.service.iconClass = vm.statuses[data.currentApproval.status].iconClass;
            vm.service.rowClass = vm.statuses[data.currentApproval.status].rowClass;
            vm.service.approvals = angular.copy(_.sortBy(data.approvals, 'createdAt'));
          }
        });
      }
    }

    /**
     * updateApprovalStatus
     * @description On change handler for approval select field; sends a POST to /service/:id/approvals
     *              to add a new approval state to the service.
     */
    function updateApprovalStatus() {
      // only show popup when changing to Approved status
      if (vm.statuses[vm.service.currentStatus].requiresConfirmation) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'referral/services/service-approval/approval-confirmation.tpl.html',
          controller: function ApprovalConfirmationModal($uibModalInstance, newStatus) {
            var vm = this;
            vm.newStatus = newStatus;
            vm.approval = {
              status: newStatus.id,
              externalID: null
            };

            /**
             * confirm
             * @description Returns the approval object upon confirmation
             */
            vm.confirm = function () {
              $uibModalInstance.close(vm.approval);
            };

            /**
             * cancel
             * @description cancels and closes the modal window
             */
            vm.cancel = function () {
              $uibModalInstance.dismiss();
            };
          },
          controllerAs: 'ac',
          bindToController: true,
          resolve: {
            newStatus: function () {
              return vm.statuses[vm.service.currentStatus];
            }
          }
        });

        modalInstance.result.then(saveApprovalStatus, function () {
          // if cancelled, revert back to previous selection
          vm.service.currentStatus = vm.service.previousStatus;
        });
      } else {
        // otherwise just save the new status change
        saveApprovalStatus({status: vm.service.currentStatus});
      }
    }

    /**
     * saveApprovalStatus
     * @description Private function for making actual save call to service approvals
     * @param approvalObj
     */
    function saveApprovalStatus(approvalObj) {
      var newApproval = new ServiceApproval(approvalObj);
      newApproval.$save(function (approval) {
        toastr.success(vm.service.displayName + ' status updated to: ' + vm.statuses[vm.service.currentStatus].name, 'Services');
        vm.onUpdate();
      });
    }
  }

})();
