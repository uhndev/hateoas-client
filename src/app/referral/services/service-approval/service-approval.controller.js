(function() {
  'use strict';

  angular
    .module('altum.referral.serviceApproval.controller', [
      'ngResource',
      'ngMaterial'
    ])
    .controller('ServiceApprovalController', ServiceApprovalController);

  ServiceApprovalController.$inject = ['$resource', 'AltumAPIService', 'API', 'toastr'];

  function ServiceApprovalController($resource, AltumAPI, API, toastr) {
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

    function init(reset) {
      // get dictionary of statuses
      vm.statuses = _.indexBy(vm.statuses, 'id');

      // check if passed in service object with id without populated approvals, then fetch from server
      if (!vm.service.approvals || reset) {
        AltumAPI.Service.get({id: vm.service.id, populate: ['currentApproval', 'approvals']}, function (data) {
          if (data.approvals.length > 0) {
            vm.service.currentStatus = data.currentApproval.status;
            vm.service.iconClass = vm.statuses[data.currentApproval.status].iconClass;
            vm.service.rowClass = vm.statuses[data.currentApproval.status].rowClass;
            vm.service.approvals = angular.copy(_.sortBy(data.approvals, 'createdAt'));
          }
        });
      }
    }

    function updateApprovalStatus() {
      var newApproval = new ServiceApproval({status: vm.service.currentStatus});
      newApproval.$save(function (approval) {
        toastr.success(vm.service.displayName + ' status updated to: ' + vm.statuses[vm.service.currentStatus].name, 'Services');
        init(true);
      });
    }
  }

})();
