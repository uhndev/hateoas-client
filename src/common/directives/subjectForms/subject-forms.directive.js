/**
 * @name dados-form
 * @description Directive that renders the form based on broadcasted data. Listens for 'FormLoaded' event.
 * @see  dados.schedule.form.controller
 */

(function() {
  'use strict';
  angular
      .module('dados.common.directives.subjectForms', [
        'dados.common.directives.subjectForms.controller',
        'dados.common.directives.dadosForm'
      ])
    .directive('subjectForms', function() {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          session: '=',
          schedule: '='
        },
        templateUrl: 'directives/subjectForms/subject-forms.tpl.html',
        controller: 'SubjectFormsController',
        controllerAs: 'subjectForms',
        bindToController: true
      };
    });
})();
