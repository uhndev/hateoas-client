/**
 * @name service-approval
 * @description Takes a service object and populates/manages approvals for it.
 * @example
 *    <sevice-approval service="serviceObj" statuses="statuses"></service-approval>
 *
 */
(function() {
  'use strict';

  angular
    .module('altum.referral.serviceApproval', [
      'altum.referral.serviceApproval.controller'
    ])
    .component('serviceApproval', {
      bindings: {
        service: '=',
        statuses: '=',
        onUpdate: '&',
        statusType: '@'  // approval or completion
      },
      templateUrl: 'referral/services/service-approval/service-approval.tpl.html',
      controller: 'ServiceApprovalController',
      controllerAs: 'sap'
    });
})();
