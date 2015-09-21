(function() {
  'use strict';

  angular
    .module('dados.survey.service', [
      'dados.survey.constants',
      'dados.common.services.resource'
    ])
    .service('SurveyService', SurveyService)
    .service('SessionService', SessionService);

  SurveyService.$inject = ['ResourceFactory', 'SURVEY_API'];
  SessionService.$inject = ['ResourceFactory', 'SESSION_API'];

  function SurveyService(ResourceFactory, SURVEY_API) {
    return ResourceFactory.create(SURVEY_API.url);
  }

  function SessionService(ResourceFactory, SESSION_API) {
    return ResourceFactory.create(SESSION_API.url);
  }

})();
