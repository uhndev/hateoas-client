(function() {
  'use strict';

  angular.module('dados.common.directives.surveyBuilder', [
    'dados.survey.service',
    'dados.common.directives.surveyBuilder.controller',
    'dados.common.directives.surveyBuilder.directive',
    'dados.common.directives.sessionBuilder.controller',
    'dados.common.directives.sessionBuilder.directive'
  ]);
})();
