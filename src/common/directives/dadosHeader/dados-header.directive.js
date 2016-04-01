(function () {
  'use strict';

  angular
    .module('dados.header.directive', [])
    .component('dadosHeader', {
      templateUrl: 'directives/dadosHeader/dados-header.tpl.html',
      controller: 'HeaderController',
      controllerAs: 'header'
    });

})();
