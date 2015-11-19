(function() {
  'use strict';
  angular
    .module('dados.subjectportal.constants', ['dados.constants'])
    .service('STUDYSUBJECT_API', StudySubject);

  StudySubject.$inject = ['API'];

  function StudySubject(API) {
    return { url: API.url() + '/studysubject/:id' };
  }

})();
