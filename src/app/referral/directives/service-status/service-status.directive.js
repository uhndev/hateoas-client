/**
 * @name service-status
 * @description Takes a service object and populates/manages approvals for it.
 * @example
 *    <service-status service="serviceObj" statuses="statuses"></service-status>
 *
 */
(function() {
  'use strict';

  angular
    .module('altum.referral.serviceStatus', [
      'altum.referral.serviceStatus.controller'
    ])
    .component('serviceStatus', {
      bindings: {
        service: '=',
        onUpdate: '&?',
        statusType: '@', // approval or completion
        placement: '@'   // placement of popover
      },
      templateUrl: 'referral/directives/service-status/service-status.tpl.html',
      controller: 'ServiceStatusController',
      controllerAs: 'serviceStatus'
    });
})();
