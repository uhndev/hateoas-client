(function() {
  'use strict';

  angular
    .module('dados.subject.service', [
      'dados.constants',
      'dados.common.services.resource'
    ])
    .service('SubjectService', SubjectService)
    .service('SubjectEnrollmentService', SubjectEnrollmentService)
    .service('SubjectScheduleService', SubjectScheduleService);

  [SubjectService, SubjectEnrollmentService, SubjectScheduleService].map(function (service) {
    service.$inject = ['ResourceFactory', 'API'];
  });

  function SubjectService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('subject'));
  }

  function SubjectEnrollmentService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('subjectenrollment'));
  }

  function SubjectScheduleService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('subjectschedule'));
  }

})();
