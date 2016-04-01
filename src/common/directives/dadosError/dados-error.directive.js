(function() {
  'use strict';
  angular
    .module('dados.common.directives.dadosError', [
      'sails.io',
      'dados.common.directives.dadosError.controller',
      'dados.common.directives.dadosError.service'
    ])
    .component('dadosError', {
      controller: 'ErrorController',
      controllerAs: 'error'
    });
})();
