(function () {
  'use strict';
  angular
  .module('altum.referral.register.controller',[])
  .controller('ReferralRegisterController', ReferralRegisterController);

  ReferralRegisterController.$inject = ['$scope', '$location','$state', 'DefaultRouteService','resolvedReferral', '$resource', 'toastr', 'AltumAPIService'];

  function ReferralRegisterController ($scope, $location, $state, DefaultRoute, resolvedReferral, $resource, toastr, AltumAPIService) {
    var vm = this;
    vm.referral = resolvedReferral;
    //functions
    vm.save = save;
    vm.referralAdd = referralAdd;
    vm.cancel = cancel;

    init();
    //For later functionality
    function init() {
    }

    /**
    * save function
    * @description to save a pre-existing referralState
    */
    function save() {
      vm.referral.$update().then(function (resp) {
        toastr.success('Updated referral ' + resp.items.id + '!');
        $location.path('/referral');
        $state.go('hateoas');
      },
      function (err) {
        toastr.error('Updating referral ' + 'failed. ' + err);
        console.log('Updating referral ' + 'failed. ' + err);
      });
    }

    /**
     * referralAdd
     * @description Function for adding a new referral
     * @param isValid
     */
    function referralAdd(isValid) {
      var newReferral = new AltumAPIService.Referral();
      _.extend(newReferral, vm.referral);
      newReferral.$save().then(function (resp) {
        toastr.success('New referral created');
        $location.path('/referral');
        $state.go('hateoas');
      },
      function (err) {
        toastr.error('failed to create the referral')
        console.log('failed to created the referral');
      });
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
     *backbutton watcher
     *@description this is used to keep track of when the back button is pressed, takes user back to referral pageTitle
     */
    $scope.$on('$locationChangeStart', function (e, currentHref, prevHref) {
      if ($state.is('newReferral') || $state.is('editReferral') && prevHref !== currentHref) {
        DefaultRoute.resolve();
      }
    });
  }
})();
