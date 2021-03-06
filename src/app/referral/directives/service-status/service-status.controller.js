(function () {
  'use strict';

  angular
    .module('altum.referral.serviceStatus.controller', [
      'ngResource',
      'ngMaterial',
      'altum.referral.serviceStatus.confirmation.controller'
    ])
    .constant('STATUS_TYPES', {
      'approval': {
        'model': 'approval',
        'collection': 'approvals',
        'currentType': 'currentApproval',
        'currentStatus': 'currentStatus',
        'statusName': 'statusName',
        'populate': ['currentApproval', 'approvals'],
        'historyTitle': 'APP.REFERRAL.DIRECTIVES.SERVICE_STATUS.LABELS.APPROVAL_HISTORY',
        'detailColumns': {
          'name': 'COMMON.MODELS.APPROVAL.EXTERNAL_APPROVAL_ID',
          'values': [
            {
              'name': 'COMMON.MODELS.APPROVAL.EXTERNAL_APPROVAL_ID',
              'type': 'text',
              'value': 'externalID'
            }
          ]
        }
      },
      'completion': {
        'model': 'completion',
        'collection': 'completion',
        'currentType': 'currentCompletion',
        'currentStatus': 'currentCompletionStatus',
        'statusName': 'completionStatusName',
        'populate': ['currentCompletion', 'completion'],
        'historyTitle': 'APP.REFERRAL.DIRECTIVES.SERVICE_STATUS.LABELS.COMPLETION_HISTORY',
        'detailColumns': {
          'name': 'APP.REFERRAL.DIRECTIVES.SERVICE_STATUS.COMPLETION.DATE',
          'values': [
            {
              'name': 'COMMON.MODELS.COMPLETION.DATE',
              'type': 'date',
              'value': 'cancellationDate'
            },
            {
              'name': 'COMMON.MODELS.COMPLETION.DATE',
              'type': 'date',
              'value': 'completionDate'
            }
          ]
        }
      },
      'billingstatus': {
        'model': 'billingstatus',
        'collection': 'billingStatuses',
        'currentType': 'currentBillingStatus',
        'currentStatus': 'currentBillingStatusStatus',
        'statusName': 'billingStatusName',
        'populate': ['currentBillingStatus', 'billingStatuses'],
        'historyTitle': 'APP.REFERRAL.DIRECTIVES.SERVICE_STATUS.LABELS.BILLING_HISTORY',
        'detailColumns': {
          'name': 'APP.REFERRAL.DIRECTIVES.SERVICE_STATUS.BILLING_STATUS.DATE',
          'values': [
            {
              'type': 'date',
              'value': 'paidDate'
            },
            {
              'type': 'date',
              'value': 'deniedDate'
            },
            {
              'type': 'date',
              'value': 'rejectedDate'
            }
          ]
        }
      },
      'reportstatus': {
        'model': 'reportstatus',
        'collection': 'reportStatuses',
        'currentType': 'currentReportStatus',
        'currentStatus': 'currentReportStatusStatus',
        'statusName': 'reportStatusName',
        'populate': ['currentReportStatus', 'reportStatuses'],
        'historyTitle': 'APP.REFERRAL.DIRECTIVES.SERVICE_STATUS.LABELS.REPORT_HISTORY',
        'detailColumns': {}
      }
    })
    .controller('ServiceStatusController', ServiceStatusController);

  ServiceStatusController.$inject = ['$scope', '$resource', 'AltumAPIService', 'API', '$uibModal', 'toastr', 'STATUS_TYPES'];

  function ServiceStatusController($scope, $resource, AltumAPI, API, $uibModal, toastr, STATUS_TYPES) {
    var vm = this;

    // bindable variables
    var previousStatus = null;
    var statusType = vm.statusType || 'approval';
    var SystemForm = $resource(API.url() + '/systemform');
    var ServiceStatus = $resource(API.url() + '/service');
    var ServiceApproval;

    vm.defaults = STATUS_TYPES[statusType];
    vm.onUpdate = vm.onUpdate || fetchStatusHistory;
    vm.currentType = vm.defaults.currentType;
    vm.collection = vm.defaults.collection;
    vm.currentStatus = vm.defaults.currentStatus;
    vm.statusName = vm.defaults.statusName;
    vm.placement = vm.placement || 'left';
    vm.disabled = vm.disabled || false;

    vm.service = vm.service || {};
    vm.statusTemplate = {};
    AltumAPI.Status.query({where: {category: vm.statusType}}, function (statuses) {
      // get dictionary of statuses
      vm.statuses = _.indexBy(statuses, 'id');
    });
    vm.approvalPopover = {
      templateUrl: 'referral/directives/service-status/service-status-detail.tpl.html',
      title: vm.defaults.historyTitle
    };

    // bindable methods
    vm.init = init;
    vm.updateApprovalStatus = updateApprovalStatus;
    vm.editStatusType = editStatusType;
    vm.renderStatusData = renderStatusData;

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      ServiceApproval = $resource(API.url() + '/service/' + vm.service.id + '/' + vm.collection);
      // check if passed in service object with id without populated collections, then fetch from server
      if (!vm.service[vm.collection]) {
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
          // vm.service.rowClass = vm.statuses[data.items[vm.currentType].status].rowClass;
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
          template: '<form-directive form="confirmationModal.statusTemplateForm" ' +
          'on-submit="confirmationModal.saveAnswers()" ' +
          'on-cancel="confirmationModal.cancel()">' +
          '</form-directive>',
          controller: 'ApprovalConfirmationModal',
          controllerAs: 'confirmationModal',
          bindToController: true,
          resolve: {
            newStatus: function () {
              return vm.statuses[vm.service[vm.currentStatus]];
            },
            statusType: function () {
              return statusType;
            },
            statusTemplateForm: function (StatusFormFactory) {
              var newStatus = angular.copy(vm.statuses[vm.service[vm.currentStatus]]);

              // if overrideForm set, fetch systemform from API
              if (newStatus.overrideForm) {
                return SystemForm.get({id: newStatus.overrideForm}).$promise.then(function (data) {
                  return data.items;
                });
              }
              // otherwise, parse newStatus template into a systemform and filter based on status.rules
              else {
                return StatusFormFactory.buildStatusForm(vm.statusTemplate, newStatus, statusType, vm.service);
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

    /**
     * renderStatusData
     * @description Returns array of status data based on non-null values set in detailColumns
     * @param approval
     */
    function renderStatusData(approval) {
      var data = '-';
      var detailColumn =  _.find(vm.defaults.detailColumns.values, function (column) {
        return approval && !_.isNull(approval[column.value]);
      });

      if (detailColumn) {
        switch (detailColumn.type) {
          case 'text':
            data = approval[detailColumn.value];
            break;
          case 'date':
            data = moment(approval[detailColumn.value]).utc().format('MMM D, YYYY');
            break;
          default: break;
        }
      }
      return data;
    }

    /**
     * editStatusType
     * @description On click handler for editing a row from the status history table
     */
    function editStatusType(statusData) {
      // only show popup when changing to Approved status
      if (vm.statuses[statusData.status].requiresConfirmation) {
        var modalInstance = $uibModal.open({
          animation: true,
          template: '<form-directive form="confirmationModal.statusTemplateForm" ' +
          'on-submit="confirmationModal.saveAnswers()" ' +
          'on-cancel="confirmationModal.cancel()">' +
          '</form-directive>',
          controller: 'ApprovalConfirmationModal',
          controllerAs: 'confirmationModal',
          bindToController: true,
          resolve: {
            newStatus: function () {
              return vm.statuses[statusData.status];
            },
            statusType: function () {
              return statusType;
            },
            statusTemplateForm: function (StatusFormFactory) {
              var newStatus = angular.copy(vm.statuses[statusData.status]);

              // if overrideForm set, fetch systemform from API
              if (newStatus.overrideForm) {
                return SystemForm.get({id: newStatus.overrideForm}).$promise.then(function (data) {
                  return data.items;
                });
              }
              // otherwise, parse newStatus template into a systemform and filter based on status.rules
              else {
                return StatusFormFactory.buildStatusForm(vm.statusTemplate, newStatus, statusType, vm.service)
                  .then(function (statusForm) {
                    _.each(statusForm.form_questions, function (question) {
                      question.field_value = statusData[question.field_name];
                    });
                    return statusForm;
                  });
              }
            }
          }
        });

        modalInstance.result.then(function (updatedStatusData) {
          var StatusTypeResource = $resource(API.url() + '/' + vm.statusType + '/:id', {id: '@id'}, {
            'update': {method: 'PUT'}
          });
          // update approval/completion/billingstatus/reportstatus inplace, then update current for selected service
          StatusTypeResource.update(_.merge(updatedStatusData, {id: statusData.id}), function (approval) {
            var currentServiceStatus = {id: vm.service.id};
            currentServiceStatus[vm.currentType] =  vm.service[vm.currentType];
            AltumAPI.Service.update(currentServiceStatus, function (updatedService) {
              toastr.success(vm.service.displayName + ' status updated!', 'Services');
              vm.onUpdate();
            });
          });
        });
      }
    }

    $scope.$watch('serviceStatus.service', watchServiceChange);
  }

})();
