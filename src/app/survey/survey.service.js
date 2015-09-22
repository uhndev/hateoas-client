(function() {
  'use strict';

  angular
    .module('dados.survey.service', [
      'dados.survey.constants',
      'dados.common.services.resource'
    ])
    .service('SurveyService', SurveyService);

  SurveyService.$inject = ['ResourceFactory', 'SURVEY_API'];

  function SurveyService(ResourceFactory, SURVEY_API) {
    return ResourceFactory.create(SURVEY_API.url);
  }

})();
