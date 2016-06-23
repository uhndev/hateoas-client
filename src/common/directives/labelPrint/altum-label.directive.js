(function () {
  'use strict';

  angular
    .module('altum.labelPrint', ['altum.labelPrint.controller'])
    .component('altumLabelPrint', {
      bindings: {
        referralInfo: '='
      },
      templateUrl: 'directives/labelPrint/altum-label.tpl.html',
      controller: 'LabelPrintController',
      controllerAs: 'alp'
    });

})();

