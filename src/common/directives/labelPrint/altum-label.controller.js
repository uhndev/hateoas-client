/**
 * Created by calvinsu on 2016-01-14.
 */
(function () {
  'use strict';

  angular
    .module('altum.labelPrint.controller', ['dados.constants'])
    .controller('LabelPrintController', LabelPrintController);

  LabelPrintController.$inject = [];

  function LabelPrintController() {
    var vm = this;

    // bindable variables

    // bindable methods
    vm.printLabel = printLabel;

    ///////////////////////////////////////////////////////////////////////////
    /**
     * printLabel
     * @descriptin Function to print Label
     */
    function printLabel() {
      var zpl = "^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR5,5~SD15^JUS^LRN^CI0^XZ ^XA";
        zpl += "^MMT ^PW812 ^LL0305 ^LS0 ^FT771,246^A0I,51,50^FH\^FD" + vm.referralInfo.clientcontact.firstName + " " + vm.referralInfo.clientcontact.middleName + " " + vm.referralInfo.clientcontact.lastName + "^FS";
        zpl +="^FT768,206^A0I,28,28^FH\^FDGender: " + vm.referralInfo.clientcontact.gender + "^FS";
        zpl +=" ^FT510,206^A0I,28,28^FH\^FD" + "program" + "^FS";
        zpl += " ^FT230,205^A0I,28,28^FH\^FDMRN:  12345678^FS ^FT766,167^A0I,28,28^FH\^FD78 ATWOOD AVE. GEORGETOWN^FS ^FT766,133^A0I,28,28^FH\^FDON     L7G 6A1     416-566-7661^FS ^FT766,99^A0I,28,28^FH\^FDWSIB:  26982941     Reg Date:  14/01/16^FS ^FT766,65^A0I,28,28^FH\^FDLanguage:  ENGLISH    Interpreter:  No^FS ^FT766,31^A0I,28,28^FH\^FDAcc/Loss Date:  09/06/14     Birth:  13/12/1978^FS";
       zpl += "^PQ" + vm.copies + ",0,1,Y";
       zpl += "^XZ";
      var ip_addr = vm.ip;
      var url = "http://"+ip_addr+"/pstprnt";
      var method = "POST";
      var async = true;
      var request = new XMLHttpRequest();

      request.open(method, url, async);
     // request.setRequestHeader("Content-Length", zpl.length);

      // Actually sends the request to the server.
      request.send(zpl);
      //alert(vm.referralInfo.clientcontact.firstName);

    }
  }

})();

