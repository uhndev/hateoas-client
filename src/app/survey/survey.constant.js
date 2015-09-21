(function() {
  'use strict';
  angular
    .module('dados.survey.constants', ['dados.constants'])
    .service('SURVEY_API', Survey)
    .service('SESSION_API', Session);

  Survey.$inject = ['API'];
  Session.$inject = ['API'];

  function Survey(API) {
    return { url: API.url() + '/survey/:id' };
  }

  function Session(API) {
    return { url: API.url() + '/session/:id' };
  }

})();
