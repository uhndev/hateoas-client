(function() {
  'use strict';
  angular
    .module('dados.subjectportal.constants', ['dados.constants'])
    .service('STUDYSUBJECT_API', StudySubject)
    .service('SCHEDULESUBJECT_API', ScheduleSubject);

  StudySubject.$inject = ['API'];
  ScheduleSubject.$inject = ['API'];

  function StudySubject(API) {
    return { url: API.url() + '/studysubject/:id' };
  }

  function ScheduleSubject(API) {
    return {url: API.url() + '/schedulesubjects/:id'};
  }

  })();
