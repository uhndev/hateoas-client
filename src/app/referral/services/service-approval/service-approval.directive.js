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
    .directive('serviceApproval', serviceApproval);

  serviceApproval.$inject = [];

  function serviceApproval() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        service: '=',
        statuses: '='
      },
      templateUrl: 'referral/services/service-approval/service-approval.tpl.html',
      controller: 'ServiceApprovalController',
      controllerAs: 'sap',
      bindToController: true
    };
  }
})();
