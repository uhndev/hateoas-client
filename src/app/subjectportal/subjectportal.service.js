(function() {
  'use strict';

  angular
    .module('dados.subjectportal.service', [
      'dados.subjectportal.constants',
      'dados.common.services.resource'
    ])
    .service('StudySubjectService', StudySubjectService)
    .service('ScheduleSubjectsService', ScheduleSubjectsService);

  StudySubjectService.$inject = ['$resource', 'STUDYSUBJECT_API'];
  ScheduleSubjectsService.$inject = ['$resource', 'SCHEDULESUBJECTS_API'];

  function StudySubjectService($resource, STUDYSUBJECT) {
    return $resource(STUDYSUBJECT.url, {id : '@id'},
      {
        'get' : {method: 'GET', isArray: false, transformResponse: _.transformHateoas },
        'query' : {method: 'GET', isArray: false },
        'update' : {method: 'PUT', isArray: false },
        'save' : {method: 'POST', isArray: false, transformResponse: _.transformHateoas }
      }
    );
  }

  function ScheduleSubjectsService($resource, SCHEDULESUBJECTS) {
    return $resource(SCHEDULESUBJECTS.url, {id : '@id'},
      {
        'get' : {method: 'GET', isArray: false, transformResponse: _.transformHateoas },
        'query' : {method: 'GET', isArray: false },
        'update' : {method: 'PUT', isArray: false },
        'save' : {method: 'POST', isArray: false, transformResponse: _.transformHateoas }
      }
    );
  }

})();
