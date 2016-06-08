(function () {
  'use strict';

  angular
    .module('altum.referral.serviceStatus.controller', [
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
      },
      'billing': {
        'collection': 'billingStatuses',
        'currentType': 'currentBillingStatus',
        'currentStatus': 'currentBillingStatusStatus',
        'statusName': 'billingStatusName',
        'populate': ['currentBillingStatus', 'billingStatuses'],
        'detailColumns': [
          {
            'name': 'COMMON.MODELS.BILLING_STATUS.PAID_DATE',
            'type': 'date',
            'value': 'paidDate'
          },
          {
            'name': 'COMMON.MODELS.BILLING_STATUS.DENIED_DATE',
            'type': 'date',
            'value': 'deniedDate'
          },
          {
            'name': 'COMMON.MODELS.BILLING_STATUS.REJECTED_DATE',
            'type': 'date',
            'value': 'rejectedDate'
          }
        ]
      }
    })
    .controller('ServiceStatusController', ServiceStatusController)
    .controller('ApprovalConfirmationModal', ApprovalConfirmationModal);

  ServiceStatusController.$inject = ['$scope', '$resource', 'AltumAPIService', 'API', '$uibModal', 'toastr', 'STATUS_TYPES'];
  ApprovalConfirmationModal.$inject = ['$uibModalInstance', 'newStatus', 'statusType', 'statusTemplateForm', 'TemplateService'];

  function ServiceStatusController($scope, $resource, AltumAPI, API, $uibModal, toastr, STATUS_TYPES) {
    var vm = this;

    // bindable variables
    var previousStatus = null;
    var statusType = vm.statusType || 'approval';
    vm.defaults = STATUS_TYPES[statusType];
    vm.onUpdate = vm.onUpdate || fetchStatusHistory;
    vm.currentType = vm.defaults.currentType;
    vm.collection = vm.defaults.collection;
    vm.currentStatus = vm.defaults.currentStatus;
    vm.statusName = vm.defaults.statusName;
    vm.placement = vm.placement || 'left';

    vm.service = vm.service || {};
    vm.statusTemplate = {};
    AltumAPI.Status.query({where: {category: vm.statusType}}, function (statuses) {
      // get dictionary of statuses
      vm.statuses = _.indexBy(statuses, 'id');
    });
    vm.approvalPopover = {
      templateUrl: 'referral/directives/service-status/service-status-detail.tpl.html',
      title: _.startCase(statusType) + ' History'
    };

    // bindable methods
    vm.updateApprovalStatus = updateApprovalStatus;

    var SystemForm = $resource(API.url() + '/systemform');
    var ServiceStatus = $resource(API.url() + '/service');
    var ServiceApproval = $resource(API.url() + '/service/' + vm.service.id + '/' + vm.collection);

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      // check if passed in service object with id without populated approvals/completions, then fetch from server
      if (!vm.service.approvals || !vm.service.completion || !vm.service.billingStatuses) {
        fetchStatusHistory();
      }
    }

    /**
     * fetchStatusHistory
     * @description Utility function for fetching a service's status history and display classes
     */
    function fetchStatusHistory() {
      ServiceStatus.get({id: vm.service.id, populate: vm.defaults.populate}, function (data) {
        if (data.items[vm.collection].length > 0) {
          previousStatus = data.items[vm.currentType].status;
          vm.service[vm.currentStatus] = data.items[vm.currentType].status;
          vm.service.iconClass = vm.statuses[data.items[vm.currentType].status].iconClass;
          vm.service.rowClass = vm.statuses[data.items[vm.currentType].status].rowClass;
          vm.service[vm.collection] = angular.copy(_.sortBy(data.items[vm.collection], 'createdAt'));

          // fetch hateoas template for new status type and filter fields based on rules
          vm.statusTemplate = _.find(data.template.data, {name: vm.currentType});
        }
      });
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
          template: '<form-directive form="ac.statusTemplateForm" on-submit="ac.confirm()" on-cancel="ac.cancel()"></form-directive>',
          controller: 'ApprovalConfirmationModal',
          controllerAs: 'ac',
          bindToController: true,
          resolve: {
            newStatus: function () {
              return vm.statuses[vm.service[vm.currentStatus]];
            },
            statusType: function () {
              return statusType;
            },
            statusTemplateForm: function (TemplateService) {
              var newStatus = angular.copy(vm.statuses[vm.service[vm.currentStatus]]);

              // if overrideForm set, fetch systemform from API
              if (newStatus.overrideForm) {
                return SystemForm.get({id: newStatus.overrideForm}).$promise.then(function (data) {
                  return data.items;
                });
              }
              // otherwise, parse newStatus template into a systemform and filter based on status.rules
              else {
                var filteredStatusTemplate = angular.copy(vm.statusTemplate);
                filteredStatusTemplate.data = _.filter(filteredStatusTemplate.data, function (field) {
                  return _.contains(vm.statuses[vm.service[vm.currentStatus]].rules.requires[statusType], field.name);
                });
                var form = TemplateService.parseToForm({}, filteredStatusTemplate);
                form.form_title = 'Status Confirmation';
                form.form_submitText = 'Change Status';
                return form;
              }
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

    /**
     * watchServiceChange
     * @description Watches service ids which is changed, should update the status history of the newly selected service
     * @param newVal
     * @param oldVal
     */
    function watchServiceChange(newVal, oldVal) {
      if (newVal && newVal.id !== oldVal.id && _.has(newVal, 'id')) {
        fetchStatusHistory();
      }
    }
    $scope.$watch('serviceStatus.service', watchServiceChange);
  }

  function ApprovalConfirmationModal($uibModalInstance, newStatus, statusType, statusTemplateForm, TemplateService) {
    var vm = this;
    vm.newStatus = newStatus;
    vm.statusTemplateForm = statusTemplateForm;

    vm.statusData = {
      status: newStatus.id
    };

    // set required fields to null in approval object
    _.each(vm.newStatus.rules.requires[statusType], function (field) {
      vm.statusData[field] = null;
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
      var answers = _.merge(vm.statusData, TemplateService.formToObject(vm.statusTemplateForm));
      $uibModalInstance.close(answers);
    };

    /**
     * cancel
     * @description cancels and closes the modal window
     */
    vm.cancel = function () {
      $uibModalInstance.dismiss();
    };
  }

})();
