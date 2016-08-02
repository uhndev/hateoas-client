/**
 * Created by calvinsu on 2016-01-14.
 */
(function () {
  'use strict';

  angular
    .module('altum.labelPrint.controller', ['dados.constants'])
    .controller('LabelPrintController', LabelPrintController);

  LabelPrintController.$inject = ['toastr'];

  function LabelPrintController(toastr) {
    var vm = this;

    // bindable variables
    vm.copies = 1;
    vm.type = vm.type || null;
    vm.printer = vm.printer || null;
    vm.zpl = null;

    // bindable methods
    vm.printLabel = printLabel;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * printLabel
     * @description Function to print Label
     */
    function printLabel() {
      var interpreter = vm.referralInfo.client_interpreter ? 'Yes' : 'No';
      switch (vm.type.id){
        case 1:
          vm.zpl = '^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR5,5~SD15^JUS^LRN^CI0^XZ ^XA';
          vm.zpl += '^MMT ^PW812 ^LL0305 ^LS0 ^FT771,246^A0I,51,50^FH\^FD' + vm.referralInfo.client_firstName.toUpperCase() + ' ' + vm.referralInfo.client_lastName.toUpperCase() + '^FS';
          vm.zpl += '^FT768,206^A0I,28,28^FH\^FDGender: ' + vm.referralInfo.client_gender + '^FS';
          vm.zpl += '^FT510,206^A0I,28,28^FH\^FD' + vm.referralInfo.program_name + '^FS';
          vm.zpl += '^FT211,262^A0I,28,28^FH\^FDMRN: ' + vm.referralInfo.client_mrn + '^FS';
          vm.zpl += '^FT766,167^A0I,28,28^FH\^FD' + vm.referralInfo.client_address1 + '. ' + vm.referralInfo.client_cityName + '^FS';
          vm.zpl += '^FT766,133^A0I,28,28^FH\^FD' + vm.referralInfo.client_province + ' ' + vm.referralInfo.client_postalCode + ' ' + vm.referralInfo.client_homePhone + '^FS';
          vm.zpl += '^FT766,99^A0I,28,28^FH\^FDCLAIM: ' + vm.referralInfo.claimNumber + '    Ref Date:  ' + moment(vm.referralInfo.referralDate).format('DD/MM/YYYY') + '^FS';
          vm.zpl += '^FT766,65^A0I,28,28^FH\^FDLanguage: ' + vm.referralInfo.client_language + '  ' + 'Interpreter:  ' + interpreter + '^FS';
          vm.zpl += '^FT766,31^A0I,28,28^FH\^FDAcc/Loss Date:  ' + moment(vm.referralInfo.accidentDate).format('DD/MM/YYYY') + '  Birth:  ' + moment(vm.referralInfo.client_dateOfBirth).format('DD/MM/YYYY') + '^FS';
          vm.zpl += '^PQ' + vm.copies + ',0,1,Y';
          vm.zpl += '^XZ';
          break;
        case 2:
          vm.zpl = '^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR5,5~SD15^JUS^LRN^CI0^XZ ^XA';
          vm.zpl += '^MMT ^PW812 ^LL0305 ^LS0 ^FT771,246^A0I,51,50^FH\^FD' + vm.referralInfo.client_firstName.toUpperCase() + ' ' + vm.referralInfo.client_lastName.toUpperCase() + '^FS';
          vm.zpl += '^FT766,167^A0I,40,40^FH\^FD' + vm.referralInfo.client_address1 + '^FS';
          vm.zpl += '^FT766,113^A0I,40,40^FH\^FD' + vm.referralInfo.client_cityName + ',' + vm.referralInfo.client_province + '^FS';
          vm.zpl += '^FT766,59^A0I,40,40^FH\^FD' + vm.referralInfo.client_postalCode + '^FS';
          vm.zpl += '^PQ' + vm.copies + ',0,1,Y';
          vm.zpl += '^XZ';
          break;
        default:
          alert('please choose the label type from the list');
          break;

      }

      var ip_addr = vm.printer.IP;
      var url = 'http://' + ip_addr + '/pstprnt';
      var method = 'POST';
      var async = true;
      var request = new XMLHttpRequest();

      request.open(method, url, async);
      // request.setRequestHeader("Content-Length", zpl.length);

      // Actually sends the request to the server.
      request.send(vm.zpl);

      // checking the xmlhttprequest response 4 = OK and the label printed.
      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          toastr.success('Your label has printed successfully!', 'Referral');
        } else {
          toastr.error('An error occurred when trying to print, please try again later.', 'Referral');
        }
      };

    }
  }

})();

