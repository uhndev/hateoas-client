/**
 * @name dados-form
 * @description Directive that renders the form based on passed data.
 *              'Multi' mode is default. 'Single' mode will render one question at the time
 *              and will emit 'PrevFormRequest' or 'NextFormRequest' events when end is reached.
 * @see         dados.schedule.form.controller
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
      templateUrl: 'directives/dadosForm/dados-form.tpl.html',
      controller: 'DadosFormController',
      controllerAs: 'dadosForm',
      bindings: {
        form: '=',
        mode: '@'
      }
    });
})();
