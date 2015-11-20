(function() {
  'use strict';

  angular
    .module('dados.subjectportal.service', [
      'dados.subjectportal.constants',
      'dados.common.services.resource'
    ])
    .service('StudySubjectService', StudySubjectService)
    .service('ScheduleSubjectsService', ScheduleSubjectsService);

  StudySubjectService.$inject = ['ResourceFactory', 'STUDYSUBJECT_API'];
  ScheduleSubjectsService.$inject = ['ResourceFactory', 'SCHEDULESUBJECTS_API'];

  function StudySubjectService(ResourceFactory, STUDYSUBJECT) {
    return ResourceFactory.create(STUDYSUBJECT.url);
  }

  function ScheduleSubjectsService(ResourceFactory, SCHEDULESUBJECTS) {
    return ResourceFactory.create(SCHEDULESUBJECTS.url);
  }

})();
