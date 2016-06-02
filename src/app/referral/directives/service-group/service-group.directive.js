/**
 * @name service-group
 * @description Takes a list of services and organizes them into groups
 * @example
 *    <service-group services="servies.services"
 *                   search="services.search"
 *                   bound-group-types="services.boundGroupTypes"
 *                   visit-fields="services.visitFields"
 *                   summary-fields="services.summaryFields"
 *                   on-init="services.init">
 *    </service-group>
 *
 */
(function() {
  'use strict';

  angular
    .module('altum.referral.serviceGroup', [])
    .component('serviceGroup', {
      bindings: {
        services: '=',
        search: '=',
        boundGroupTypes: '=',
        visitFields: '<',
        summaryFields: '<',
        onInit: '&'
      },
      templateUrl: 'referral/directives/service-group/service-group.tpl.html',
      controller: 'ServiceGroupController',
      controllerAs: 'serviceGroup'
    })
    .controller('ServiceGroupController', ServiceGroupController);

  ServiceGroupController.$inject = [];

  function ServiceGroupController() {

  }

})();
