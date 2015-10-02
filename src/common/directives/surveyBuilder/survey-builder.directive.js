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
    .directive('surveyBuilder', surveyBuilder)
    .directive('scrolly', function ($parse) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var raw = element[0];
          console.log('loading directive');
          var scrollingDown = true;
          var lastScrollTop = 0;

          element.bind('scroll', function () {
            console.log('in scroll');
            console.log(raw.scrollTop + raw.offsetHeight);
            console.log(raw.scrollHeight);

            var scrollTop = raw.scrollTop + raw.offsetHeight;
            scrollingDown = (scrollTop > lastScrollTop);
            lastScrollTop = scrollTop;

            if (scrollingDown) {
              if (scrollTop >= raw.scrollHeight) {
                scope.$apply(attrs.onscrolldown);
              }
            } else {
              if (scrollTop <= Math.floor(raw.scrollHeight / 1.5)) {
                scope.$apply(attrs.onscrollup);
              }
            }
          });
        }
      };
    });

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
