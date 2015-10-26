(function() {
	'use strict';
	angular
		.module('dados.subject.constants', ['dados.constants'])
    .constant('ENROLLMENT_STATUSES', [
      'REGISTERED',
      'ONGOING',
      'LOST TO FOLLOWUP',
      'WITHDRAWN',
      'INELIGIBLE',
      'DECEASED',
      'TERMINATED',
      'COMPLETED'
    ])
		.service('SUBJECT_API', Subject)
    .service('SUBJECTENROLLMENT_API', SubjectEnrollment)
    .service('SUBJECTSCHEDULE_API', SubjectSchedule);

		Subject.$inject = ['API'];
    SubjectEnrollment.$inject = ['API'];
    SubjectSchedule.$inject = ['API'];

		function Subject(API) {
			return { url: API.url() + '/subject/:id' };
		}

    function SubjectEnrollment(API) {
      return { url: API.url() + '/subjectenrollment/:id' };
    }

    function SubjectSchedule(API) {
      return { url: API.url() + '/subjectschedule/:id' };
    }

})();
