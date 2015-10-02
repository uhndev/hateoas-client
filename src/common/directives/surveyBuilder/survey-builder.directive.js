/**
 * @name survey-builder
 * @description Two-stage interface for creating and defining surveys and sessions then choosing
 *              which forms should be included in each session.  Includes a sub-directive session-builder
 *              used to add scheduled/non-scheduled sessions to the survey object.
 *
 *
 * @example
 * <survey-builder study="studyObj"
                   forms="formList"
                   survey="surveyObj"
                   is-valid="isValid"></survey-builder>
 */

(function() {
  'use strict';

  angular
    .module('dados.common.directives.surveyBuilder.directive', [])
    .directive('surveyBuilder', surveyBuilder);

  surveyBuilder.$inject = [];

  function surveyBuilder() {
    return {
      restrict: 'E',
      scope: {
        study: '=',   // the study object
        forms: '=',   // list of study forms
        survey: '=',  // main survey object we are creating/editing
        isValid: '='  // boolean denoting validity of survey
      },
      replace: true,
      templateUrl: 'directives/surveyBuilder/survey-builder.tpl.html',
      controller: 'SurveyBuilderController',
      controllerAs: 'surveyBuilder',
      bindToController: true
    };
  }

})();
