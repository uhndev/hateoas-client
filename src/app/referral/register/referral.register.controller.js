(function () {
  'use strict';
  angular
    .module('altum.referral.register.controller', [])
    .controller('ReferralRegisterController', ReferralRegisterController);

  ReferralRegisterController.$inject = [
    '$scope', '$location', '$state', 'DefaultRouteService', 'resolvedReferral', 'toastr', 'AltumAPIService'
  ];

  function ReferralRegisterController($scope, $location, $state, DefaultRoute, resolvedReferral, toastr, AltumAPIService) {
    var vm = this;

    // bindable variables
    vm.referral = resolvedReferral;
    vm.translatableTitles = {
      referralTitle: 'APP.REFERRAL.REGISTRATION.LABELS.REFERRAL_INFO',
      dateTitle: 'APP.REFERRAL.REGISTRATION.LABELS.REFERRAL_DATES',
      client: 'APP.REFERRAL.REGISTRATION.LABELS.CLIENT',
      claimNumber: 'APP.REFERRAL.REGISTRATION.LABELS.CLAIM_NUMBER',
      site: 'APP.REFERRAL.REGISTRATION.LABELS.SITE',
      program: 'APP.REFERRAL.REGISTRATION.LABELS.PROGRAM',
      physician: 'APP.REFERRAL.REGISTRATION.LABELS.PHYSICIAN',
      staff: 'APP.REFERRAL.REGISTRATION.LABELS.STAFF',
      payors: 'APP.REFERRAL.REGISTRATION.LABELS.PAYORS',
      referralDate: 'APP.REFERRAL.REGISTRATION.LABELS.REFERRAL_DATE',
      clinicDate: 'APP.REFERRAL.REGISTRATION.LABELS.CLINIC_DATE',
      accidentDate: 'APP.REFERRAL.REGISTRATION.LABELS.ACCIDENT_DATE',
      receiveDate: 'APP.REFERRAL.REGISTRATION.LABELS.RECEIVE_DATE',
      sentDate: 'APP.REFERRAL.REGISTRATION.LABELS.SENT_DATE',
      dischargeDate: 'APP.REFERRAL.REGISTRATION.LABELS.DISCHARGE_DATE',
      recMade: 'APP.REFERRAL.REGISTRATION.LABELS.RECOMMENDATIONS_MADE',
      referralComments: 'APP.REFERRAL.REGISTRATION.LABELS.COMMENTS'
    };

    // bindable methods
    vm.save = save;
    vm.referralAdd = referralAdd;
    vm.cancel = cancel;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * save function
     * @description to save a pre-existing referralState
     */
    function save() {
      vm.referral.$update().then(function (resp) {
          toastr.success('Updated referral information for client: ' + resp.items.displayName + '!', 'Referral');
          $location.path('/referral');
          $state.go('hateoas');
        },
        function (err) {
          toastr.error('Failed to update referral for client: ' + vm.referral.displayName + '.  Please try again later.', 'Referral');
        });
    }

    /**
     * referralAdd
     * @description Function for adding a new referral
     * @param isValid
     */
    function referralAdd(isValid) {
      if (isValid) {
        var newReferral = new AltumAPIService.Referral();
        _.extend(newReferral, vm.referral);
        newReferral.$save().then(function (resp) {
            toastr.success('Created new referral for client: ' + resp.displayName + '!', 'Referral');
            $location.path('/referral');
            $state.go('hateoas');
          },
          function (err) {
            toastr.error('Failed to create referral, please try again later.', 'Referral');
          });
      }
    }

    /**
     * cancel
     * @description Function for canceling the current referral
     */
    function cancel() {
      vm.referral = null;
      $location.path('/referral');
      $state.go('hateoas');
    }

    /**
     * backbutton watcher
     * @description this is used to keep track of when the back button is pressed, takes user back to referral pageTitle
     */
    $scope.$on('$locationChangeStart', function (e, currentHref, prevHref) {
      if ($state.is('newReferral') || $state.is('editReferral') && prevHref !== currentHref) {
        DefaultRoute.resolve();
      }
    });
  }
})();
