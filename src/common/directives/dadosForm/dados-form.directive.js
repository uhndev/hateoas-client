/**
 * @name dados-form
 * @description Directive representation of an individual grid element (question).
 *              Expects a question object from the array form.questions. This directive
 *              is used in plugin-editor.tpl.html as part of an ng-repeat.
 *
 * @example  <dados-form source="vm.form">
             </dados-form>
 */

(function() {
	'use strict';
	angular
    .module('dados.common.directives.dadosForm', [
      'dados.common.directives.pluginEditor.directives.uiGrid',
      'dados.common.directives.dadosForm.controller',
      'dados.common.directives.dadosForm.service'
    ])
    .directive('dadosForm', function() {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'directives/dadosForm/dados-form.tpl.html',
        controller: 'DadosFormController',
        scope: {
          source: '='
        }
      };
    });
})();
