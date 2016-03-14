/**
 * @name dados-form
 * @description Directive that renders the form based on broadcasted data. Listens for 'FormLoaded' event.
 * @see  dados.schedule.form.controller
 */

(function() {
  'use strict';
  angular
    .module('dados.common.directives.dadosForm', [
      'dados.common.directives.pluginEditor.directives.uiGrid',
      'dados.common.directives.dadosForm.controller',
      'dados.common.directives.dadosForm.service'
    ])
    .component('dadosForm', {
      restrict: 'E',
      replace: true,
      templateUrl: 'directives/dadosForm/dados-form.tpl.html',
      controller: 'DadosFormController',
      controllerAs: 'dadosForm',
      scope: {
        form: '=',
        mode: '@'
      },
      bindToController: true
    });
})();
