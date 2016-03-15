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
    .component('subjectForms', {
      templateUrl: 'directives/subjectForms/subject-forms.tpl.html',
      controller: 'SubjectFormsController',
      controllerAs: 'subjectForms',
      bindings: {
        session: '=',
        schedule: '='
      }
    });
})();
