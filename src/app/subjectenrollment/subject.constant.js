(function() {
	'use strict';
	angular
		.module('dados.subject.constants', [])
    .constant('ENROLLMENT_STATUSES', [
      'REGISTERED',
      'ONGOING',
      'LOST TO FOLLOWUP',
      'WITHDRAWN',
      'INELIGIBLE',
      'DECEASED',
      'TERMINATED',
      'COMPLETED'
    ]);

})();
