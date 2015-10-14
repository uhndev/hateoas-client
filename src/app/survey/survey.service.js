(function() {
  'use strict';

  angular
    .module('dados.survey.service', [
      'dados.constants',
      'dados.survey.constants',
      'dados.common.services.resource'
    ])
    .service('SurveyService', SurveyService)
    .service('SessionService', SessionService)
    .service('SurveySessionService', SurveySessionService);

  SurveyService.$inject = ['ResourceFactory', 'SURVEY_API'];
  SessionService.$inject = ['ResourceFactory', 'SESSION_API'];
  SurveySessionService.$inject = ['$resource', 'API'];

  function SurveyService(ResourceFactory, SURVEY_API) {
    return ResourceFactory.create(SURVEY_API.url);
  }

  function SessionService(ResourceFactory, SESSION_API) {
    return ResourceFactory.create(SESSION_API.url);
  }

  function SurveySessionService($resource, API) {
    var sessionResource = function (method) {
      return $resource(API.url() + '/survey/:surveyID/' + method + 'Sessions',
        { surveyID: '@surveyID' },
        {
          'update' : {
            method: 'PUT',
            isArray: false
          }
        }
      );
    };

    return {
      'addMultiple'   : sessionResource('add'),
      'updateMultiple': sessionResource('update'),
      'removeMultiple': sessionResource('remove')
    };
  }

})();
