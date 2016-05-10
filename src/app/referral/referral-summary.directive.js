(function() {
  angular
    .module('altum.referral.summary', [])
    .controller('ReferralSummaryController', ReferralSummaryController)
    .component('referralSummary', {
      bindings: {
        referralData: '=',
        boundGroups: '=?',
        groupTypes: '=?',
        groupFields: '=?'
      },
      controller: 'ReferralSummaryController',
      controllerAs: 'summary',
      templateUrl: 'referral/referral-summary.tpl.html'
    });

  ReferralSummaryController.$inject = ['$scope'];

  function ReferralSummaryController($scope) {
    var vm = this;

    var unregister = $scope.$watch('summary.referralData', function (oldVal, newVal) {
      if (oldVal !== newVal) {
        vm.referralData = vm.referralData || {};
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
        unregister();
      }
    });
  }

})();
