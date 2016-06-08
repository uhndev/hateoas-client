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
        configFlags: '=?'     // optional object containing flags that can be toggled
      },
      controller: 'ReferralSummaryController',
      controllerAs: 'summary',
      templateUrl: 'referral/directives/referral-summary/referral-summary.tpl.html'
    });

  ReferralSummaryController.$inject = ['$scope'];

  function ReferralSummaryController($scope) {
    var vm = this;

    // wait for data to load, then create overview object
    var unregister = $scope.$watch('summary.referralData', function (newVal, oldVal) {
      if (oldVal !== newVal && _.has(newVal, 'client_mrn')) {
        // data columns for referral overview table
        vm.referralOverview = {
          'COMMON.MODELS.CLIENT.MRN': vm.referralData.client_mrn,
          'COMMON.MODELS.REFERRAL.CLIENT': vm.referralData.client_displayName,
          'COMMON.MODELS.REFERRAL.CLAIM_NUMBER': vm.referralData.claimNumber,
          'COMMON.MODELS.REFERRAL.PROGRAM': vm.referralData.program_name,
          'COMMON.MODELS.REFERRAL.PHYSICIAN': vm.referralData.physician_name,
          'COMMON.MODELS.REFERRAL.STAFF': vm.referralData.staff_name,
          'COMMON.MODELS.REFERRAL.SITE': vm.referralData.site_name
        };

        if (vm.configFlags) { // keys of configFlags become table headers
          vm.flagOptions = _.keys(vm.configFlags);
        }

        unregister(); // unregister watcher
      }
    });
  }

})();
