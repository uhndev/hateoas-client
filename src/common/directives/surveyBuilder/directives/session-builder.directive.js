(function() {
  'use strict';

  angular
    .module('dados.common.directives.sessionBuilder.directive', [])
    .component('sessionBuilder', {
      bindings: {
        session: '=',
        generateSessions: '='
      },
      templateUrl: 'directives/surveyBuilder/partials/session-builder.tpl.html',
      controller: 'SessionBuilderController',
      controllerAs: 'sessionBuilder'
    });

})();
