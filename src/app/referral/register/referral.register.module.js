(function() {
  'use strict';
  angular.module('altum.referral.register',[
    'altum.referral.register.controller'
  ])
  .config(['$stateProvider', function($stateProvider) {
    var referralState = {
      resolve:{
        resolvedReferral: function ($resource, $stateParams, AltumAPIService) {
          if ($stateParams.id) {
            return AltumAPIService.Referral.get({id:$stateParams.id}).$promise;
          }else {
            return {};
          }
        }
      },
      templateUrl:'referral/register/referralregister.tpl.html',
      controller:'ReferralRegisterController',
      controllerAs:'RC'
    };

    $stateProvider
      .state('newReferral', _.merge({
        url: '/newReferral',
        data:{
          pageTitle: 'Add Referral',
          fullUrl: '/newReferral'
        }
      }, referralState))
      .state('editReferral',_.merge({
        url: '/editReferral/:id',
        data:{
          pageTitle: 'Edit Referral',
          fullUrl: '\/editReferral\/[0-9]+'
        }
      }, referralState));
  }]);
})();
