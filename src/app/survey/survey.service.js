(function() {
  'use strict';

  angular
    .module('dados.survey.service', [
      'dados.constants',
      'dados.common.services.resource'
    ])
    .service('SurveyService', SurveyService)
    .service('SessionService', SessionService)
    .service('SurveySessionService', SurveySessionService);

  [SurveyService, SessionService].map(function (service) {
    service.$inject = ['ResourceFactory', 'API'];
  });
  SurveySessionService.$inject = ['$resource', 'API'];

  function SurveyService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('survey'));
  }

  function SessionService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('session'));
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
