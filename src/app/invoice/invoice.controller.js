(function () {
  'use strict';

  angular
    .module('altum.invoice', [
      'ngMaterial',
      'ngResource',
      'dados.header.service'
    ])
    .controller('InvoiceController', InvoiceController);

  InvoiceController.$inject = ['$resource', '$location', 'API', 'HeaderService', 'AltumAPIService'];

  function InvoiceController($resource, $location, API, HeaderService, AltumAPI) {
    var vm = this;

    // bindable variables
    vm.url = API.url() + $location.path();

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Resource = $resource(vm.url);

      Resource.get(function (data, headers) {
        vm.allow = headers('allow');
        vm.template = data.template;
        vm.invoice = angular.copy(data.items);

        vm.invoiceServices = AltumAPI.InvoiceServiceDetail.query({
          where: {
            invoice: data.items.id
          }
        });

        var ReferralResource = $resource(API.url() + '/referral/' + data.items.referral);

        ReferralResource.get({id: data.items.referral}, function (referralData) {
          vm.referral = angular.copy(referralData.items);
          // email fields for sending email from note directive
          vm.emailInfo = {
            template: 'referral',
            data: {
              claim: vm.referral.claimNumber,
              client: vm.referral.clientcontact.displayName,
              url: encodeURI($location.absUrl())
            },
            options: {
              subject: 'Altum CMS Communication'
            }
          };

          // initialize submenu
          HeaderService.setSubmenu('referral', referralData.links);
        });
      });
    }
  }

})();
