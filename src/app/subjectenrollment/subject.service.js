(function() {
  'use strict';

  angular
    .module('dados.subject.service', [
      'dados.subject.constants',
      'dados.common.services.resource'
    ])
    .service('SubjectService', SubjectService)
    .service('SubjectEnrollmentService', SubjectEnrollmentService);

  SubjectService.$inject = ['ResourceFactory', 'SUBJECT_API'];
  SubjectEnrollmentService.$inject = ['ResourceFactory', 'SUBJECTENROLLMENT_API'];

  function SubjectService(ResourceFactory, SUBJECT_API) {
    return ResourceFactory.create(SUBJECT_API.url);
  }

  function SubjectEnrollmentService(ResourceFactory, SUBJECTENROLLMENT_API) {
    return ResourceFactory.create(SUBJECTENROLLMENT_API.url);
  }

})();
