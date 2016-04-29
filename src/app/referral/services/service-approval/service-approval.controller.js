(function () {
  'use strict';

  angular
    .module('altum.referral.serviceApproval.controller', [
      'ngResource',
      'ngMaterial'
    ])
    .constant('STATUS_TYPES', {
      'approval': {
        'collection': 'approvals',
        'currentType': 'currentApproval',
        'currentStatus': 'currentStatus',
        'statusName': 'statusName',
        'populate': ['currentApproval', 'approvals'],
        'detailColumns': [
          {
            'name': 'COMMON.MODELS.APPROVAL.EXTERNAL_APPROVAL_ID',
            'type': 'text',
            'value': 'externalID'
          }
        ]
      },
      'completion': {
        'collection': 'completion',
        'currentType': 'currentCompletion',
        'currentStatus': 'currentCompletionStatus',
        'statusName': 'completionStatusName',
        'populate': ['currentCompletion', 'completion'],
        'detailColumns': [
          {
            'name': 'COMMON.MODELS.COMPLETION.CANCELLATION_DATE',
            'type': 'date',
            'value': 'cancellationDate'
          },
          {
            'name': 'COMMON.MODELS.COMPLETION.COMPLETION_DATE',
            'type': 'date',
            'value': 'completionDate'
          }
        ]
      }
    })
    .controller('ServiceApprovalController', ServiceApprovalController);

  ServiceApprovalController.$inject = ['$resource', 'AltumAPIService', 'API', '$uibModal', 'toastr', 'STATUS_TYPES'];

  function ServiceApprovalController($resource, AltumAPI, API, $uibModal, toastr, STATUS_TYPES) {
    var vm = this;

    // bindable variables
    var previousStatus = null;
    var statusType = vm.statusType || 'approval';
    vm.defaults = STATUS_TYPES[statusType];
    vm.currentType = vm.defaults.currentType;
    vm.collection = vm.defaults.collection;
    vm.currentStatus = vm.defaults.currentStatus;
    vm.statusName = vm.defaults.statusName;

    vm.service = vm.service || {};
    vm.statuses = vm.statuses || {};
    vm.approvalPopover = {
      templateUrl: 'referral/services/service-approval/service-approval-detail.tpl.html',
      title: _.startCase(statusType) + ' History'
    };

    // bindable methods
    vm.updateApprovalStatus = updateApprovalStatus;

    var ServiceApproval = $resource(API.url() + '/service/' + vm.service.id + '/' + vm.collection);

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      // get dictionary of statuses
      vm.statuses = _.indexBy(vm.statuses, 'id');

      // check if passed in service object with id without populated approvals/completions, then fetch from server
      if (!vm.service.approvals || !vm.service.completion) {
        AltumAPI.Service.get({id: vm.service.id, populate: vm.defaults.populate}, function (data) {
          if (data[vm.collection].length > 0) {
            previousStatus = data[vm.currentType].status;
            vm.service[vm.currentStatus] = data[vm.currentType].status;
            vm.service.iconClass = vm.statuses[data[vm.currentType].status].iconClass;
            vm.service.rowClass = vm.statuses[data[vm.currentType].status].rowClass;
            vm.service[vm.collection] = angular.copy(_.sortBy(data[vm.collection], 'createdAt'));
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
      if (vm.statuses[vm.service[vm.currentStatus]].requiresConfirmation) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'referral/services/service-approval/approval-confirmation.tpl.html',
          controller: function ApprovalConfirmationModal($uibModalInstance, newStatus) {
            var vm = this;
            vm.newStatus = newStatus;
            vm.approval = {
              status: newStatus.id
            };

            // set required fields to null in approval object
            _.each(vm.newStatus.rules.requires[statusType], function (field) {
              vm.approval[field] = null;
            });

            /**
             * isFieldRequired
             * @description Returns true if field is required in confirmation form
             * @param field
             * @returns {Boolean}
             */
            vm.isFieldRequired = function (field) {
              return _.contains(vm.newStatus.rules.requires[statusType], field);
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
              return vm.statuses[vm.service[vm.currentStatus]];
            }
          }
        });

        modalInstance.result.then(saveApprovalStatus, function () {
          // if cancelled, revert back to previous selection
          vm.service[vm.currentStatus] = previousStatus;
        });
      } else {
        // otherwise just save the new status change
        saveApprovalStatus({status: vm.service[vm.currentStatus]});
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
        toastr.success(vm.service.displayName + ' status updated to: ' + vm.statuses[vm.service[vm.currentStatus]].name, 'Services');
        vm.onUpdate();
      });
    }
  }

})();
