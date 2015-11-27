(function() {
  'use strict';

  angular
    .module('dados.subjectportal.service', [
      'dados.constants'
    ])
    .service('StudySubjectService', StudySubjectService)
    .service('ScheduleSubjectService', ScheduleSubjectService);

  [StudySubjectService, ScheduleSubjectService].map(function (service) {
    service.$inject = ['$resource', 'API'];
  });

  function StudySubjectService($resource, API) {
    return $resource(API.url('studysubject'), {id : '@id'},
      {
        'get' : {method: 'GET', isArray: false, transformResponse: _.transformHateoas },
        'query' : {method: 'GET', isArray: false },
        'update' : {method: 'PUT', isArray: false },
        'save' : {method: 'POST', isArray: false, transformResponse: _.transformHateoas }
      }
    );
  }

  function ScheduleSubjectService($resource, API) {
    return $resource(API.url('schedulesubjects'), {id : '@id'},
      {
        'get' : {method: 'GET', isArray: false, transformResponse: _.transformHateoas },
        'query' : {method: 'GET', isArray: false },
        'update' : {method: 'PUT', isArray: false },
        'save' : {method: 'POST', isArray: false, transformResponse: _.transformHateoas }
      }
    );
  }

})();
