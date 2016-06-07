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
        console.log('Updating client ' + 'failed. ' + err);
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
        console.log('failed to created the client');
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

    //backbutton watcher
    $scope.$on('$locationChangeStart', function (e, currentHref, prevHref) {
      if ($state.is('newReferral') || $state.is('editReferral') && prevHref !== currentHref) {
        DefaultRoute.resolve();
      }
    });
  }
})();
