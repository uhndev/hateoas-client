(function() {
  'use strict';

  angular
    .module('dados.common.directives.sessionBuilder.directive', [])
    .directive('sessionBuilder', sessionBuilder);

  sessionBuilder.$inject = [];

  function sessionBuilder() {
    return {
      restrict: 'E',
      scope: {
        session: '=',
        generateSessions: '='
      },
      replace: true,
      templateUrl: 'directives/surveyBuilder/partials/session-builder.tpl.html',
      controller: 'SessionBuilderController',
      controllerAs: 'sessionBuilder',
      bindToController: true
    };
  }

})();
