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
    .directive('serviceStatus', function () {
      return {
        restrict: 'E',
        scope: {
          service: '=',
          onUpdate: '&?',
          statusType: '@', // approval or completion
          placement: '@',  // placement of popover
          disabled: '=?'
        },
        templateUrl: 'referral/directives/service-status/service-status.tpl.html',
        controller: 'ServiceStatusController',
        controllerAs: 'serviceStatus',
        bindToController: true,
        link: function (scope, element, attributes) {
          if (attributes.appendToElement) {
            // workaround for angular ui popover bug, will insert history element inside
            // directive element so that mouseover/mouseleave events still apply on both elements.
            element.bind('mouseover', function (event) {
              var historyElement = angular.element($('[uib-popover-template-popup]'));
              element.children().append(historyElement);
            });
          }
        }
      };
    });
})();
