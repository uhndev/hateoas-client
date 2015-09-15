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
        study: '=',
        forms: '=',
        survey: '=',
        isValid: '='
      },
      replace: true,
      templateUrl: 'directives/surveyBuilder/survey-builder.tpl.html',
      controller: 'SurveyBuilderController',
      controllerAs: 'surveyBuilder',
      bindToController: true
    };
  }

})();
