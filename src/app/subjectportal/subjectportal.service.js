(function() {
  'use strict';

  angular
    .module('dados.subjectportal.service', [
      'dados.subjectportal.constants',
      'dados.common.services.resource'
    ])
    .service('StudySubjectService', StudySubjectService);

  StudySubjectService.$inject = ['ResourceFactory', 'STUDYSUBJECT_API'];

  function StudySubjectService(ResourceFactory, STUDYSUBJECT) {
    return ResourceFactory.create(STUDYSUBJECT.url);
  }

})();
