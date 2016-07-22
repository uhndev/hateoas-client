(function () {
  'use strict';
  angular
    .module('dados.common.directives.modelEditors', [
      'dados.common.directives.addressEditor',
      'dados.common.directives.employeeEditor',
      'dados.common.directives.serviceEditor',
      'dados.common.directives.userEditor'
    ]);
})();
