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
        groupFields: '<?'     // array of configuration data groups that can be chosen from
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
        vm.referralOverview = [
          {
            value:vm.referralData.client_mrn,
            prompt:'COMMON.MODELS.CLIENT.MRN'
          },
          {
            prompt:'COMMON.MODELS.REFERRAL.CLIENT',
            value:vm.referralData.client_displayName
          },
          {
            prompt:'COMMON.MODELS.REFERRAL.CLAIM_NUMBER',
            value:vm.referralData.claimNumber
          },
          {
            prompt:'COMMON.MODELS.REFERRAL.PROGRAM',
            value:vm.referralData.program_name
          },
          {
            prompt:'COMMON.MODELS.REFERRAL.PHYSICIAN',
            value:vm.referralData.physician_name
          },
          {
            prompt:'COMMON.MODELS.REFERRAL.STAFF',
            value:vm.referralData.staff_name
          },
          {
            prompt:'COMMON.MODELS.REFERRAL.SITE',
            value: vm.referralData.site_name
          }

        ];
        console.log(vm.referralOverview);
        unregister(); // unregister watcher
      }
    });
  }

})();
