(function() {
  'use strict';
  angular
    .module('dados.subjectportal.constants', ['dados.constants'])
    .service('STUDYSUBJECT_API', StudySubject)
    .service('SCHEDULESUBJECTS_API', ScheduleSubjects);

  StudySubject.$inject = ['API'];
  ScheduleSubjects.$inject = ['API'];

  function StudySubject(API) {
    return { url: API.url() + '/studysubject/:id' };
  }

  function ScheduleSubjects(API) {
    return {url: API.url() + '/schedulesubjects/:id'};
  }

  })();
