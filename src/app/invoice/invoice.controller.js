(function () {
  'use strict';

  angular
    .module('altum.invoice', [
      'ngMaterial',
      'ngResource',
      'dados.header.service'
    ])
    .controller('InvoiceController', InvoiceController);

  InvoiceController.$inject = ['$resource', '$location', 'toastr', 'API', 'HeaderService', 'AltumAPIService'];

  function InvoiceController($resource, $location, toastr, API, HeaderService, AltumAPI) {
    var vm = this;

    // bindable variables
    vm.url = API.url() + $location.path();

    // data columns for groups (visits)
    vm.visitFields = [
      {
        name: 'completionDate',
        prompt: 'APP.INVOICE.LABELS.COMPLETION_DATE',
        type: 'date'
      },
      {
        name: 'altumServiceName',
        prompt: 'APP.INVOICE.LABELS.ALTUM_SERVICE',
        type: 'string'
      },
      {
        name: 'siteName',
        prompt: 'APP.INVOICE.LABELS.SITE',
        type: 'string'
      },
      {
        name: 'currentCompletionPhysicianName',
        prompt: 'APP.INVOICE.LABELS.COMPLETION_PHYSICIAN',
        type: 'string'
      },
      {
        name: 'currentCompletionStaffName',
        prompt: 'APP.INVOICE.LABELS.COMPLETION_STAFF',
        type: 'string'
      },
      {
        name: 'payorName',
        prompt: 'APP.INVOICE.LABELS.PAYOR',
        type: 'string'
      },
      {
        name: 'code',
        prompt: 'APP.INVOICE.LABELS.CODE',
        type: 'string'
      },
      {
        name: 'payorPrice',
        prompt: 'APP.INVOICE.LABELS.PAYOR_PRICE',
        type: 'price'
      }
    ];

    // bindable methods
    vm.updateInvoice = updateInvoice;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Resource = $resource(vm.url);

      Resource.get(function (data, headers) {
        vm.invoiceStatuses = _.find(data.template.data, {'name': 'status'}).value;
        vm.template = data.template;
        vm.invoice = angular.copy(data.items);

        AltumAPI.InvoiceServiceDetail.query({
          where: {
            invoice: data.items.id
          }
        }, function (invoiceServices) {
          vm.invoiceServices = invoiceServices;
          vm.totalPrice = _.sum(_.map(invoiceServices, 'payorPrice'));
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

    /**
     * updateInvoice
     * @description On change handler for updating an Invoice
     */
    function updateInvoice() {
      AltumAPI.Invoice.update(_.pick(vm.invoice, 'id', 'number', 'payor', 'comments', 'status', 'referral'), function (data) {
        vm.invoice.displayName = data.items.displayName;
        toastr.success('Successfully updated invoice: ' + vm.invoice.displayName, 'Invoice');
      });
    }
  }

})();
