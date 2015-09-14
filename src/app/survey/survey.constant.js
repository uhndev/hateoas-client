(function() {
  'use strict';
  angular
    .module('dados.survey.constants', ['dados.constants'])
    .service('SURVEY_API', Survey);

  Survey.$inject = ['API'];

  function Survey(API) {
    return { url: API.url() + '/survey/:id' };
  }

})();
