/**
 * @name referral-summary
 * @description Takes a referral object and renders a summary table of pertinent information
 *              Can also optionally include groupBy fields used for grouping
 * @example
 *    <referral-summary referral-data="services.resource.items"
                        bound-groups="billing.boundGroupTypes"
                        group-types="services.groupTypes"
                        group-fields="services.groupFields">
      </referral-summary>
 *
 */
(function() {
  angular
    .module('altum.referral.summary', [])
    .controller('ReferralSummaryController', ReferralSummaryController)
    .component('referralSummary', {
      bindings: {
        referralData: '<',    // default referral object
        boundGroups: '=?',    // object where groupType.name is bound outward
        groupTypes: '<?',     // array of names and prompts that can be bound
        groupFields: '<?',    // array of configuration data groups that can be chosen from
        configFlags: '=?',    // optional object containing flags that can be toggled
        expandToggle: '@?'    // optional flag denoting whether expandToggle button active
      },
      controller: 'ReferralSummaryController',
      controllerAs: 'referralSummary',
      templateUrl: 'referral/directives/referral-summary/referral-summary.tpl.html'
    });

  ReferralSummaryController.$inject = ['$rootScope', '$scope'];

  function ReferralSummaryController($rootScope, $scope) {
    var vm = this;
    vm.expandToggle = vm.expandToggle == 'true';
    // wait for data to load, then create overview object
    var unregister = $scope.$watch('referralSummary.referralData', function (newVal, oldVal) {
      if (oldVal !== newVal && _.has(newVal, 'client_mrn')) {
        // data columns for referral overview table

        vm.referralOverview = [
          {
            value:vm.referralData.client_mrn,
            prompt:'APP.REFERRAL.REFERRAL-SUMMARY.LABELS.MRN'
          },
          {
            prompt:'APP.REFERRAL.REFERRAL-SUMMARY.LABELS.CLIENT',
            value:vm.referralData.client_displayName
          },
          {
            prompt:'APP.REFERRAL.REFERRAL-SUMMARY.LABELS.CLAIM_NUMBER',
            value:vm.referralData.claimNumber
          },
          {
            prompt:'APP.REFERRAL.REFERRAL-SUMMARY.LABELS.PROGRAM',
            value:vm.referralData.program_name
          },
          {
            prompt:'APP.REFERRAL.REFERRAL-SUMMARY.LABELS.PHYSICIAN',
            value:vm.referralData.physician_name
          },
          {
            prompt:'APP.REFERRAL.REFERRAL-SUMMARY.LABELS.STAFF',
            value:vm.referralData.staff_name
          },
          {
            prompt:'APP.REFERRAL.REFERRAL-SUMMARY.LABELS.SITE',
            value: vm.referralData.site_name
          }
        ];

        if (vm.configFlags) { // keys of configFlags become table headers
          vm.flagOptions = _.keys(vm.configFlags);
          vm.flagOptionsPrompt = vm.flagOptions.map(function (elements) { return 'APP.REFERRAL.CONFIG.LABELS.' + elements.toUpperCase(); });
        }

        unregister(); // unregister watcher
      }
    });

    vm.toggleExpansion = function () {
      // broadcasts event to the service-group directive to expand all subGroups
      $rootScope.$broadcast('serviceGroup.expandToggle');
    };
  }

})();
