(function() {
  'use strict';

  angular
    .module('dados.subjectportal', [
      'dados.subjectportal.controller',
      'dados.subjectportal.service'
    ])
    .config(function config( $stateProvider ) {
      $stateProvider
        .state( 'subjectportal', {
          url: '/subjectportal',
          controller: 'SubjectPortalController',
          controllerAs: 'sp',
          templateUrl: 'subjectportal/subjectportal.tpl.html',
          resolve: {
            StudySubjects: function (StudySubjectService) {
              return StudySubjectService.query();
            },
            ScheduleSubjects: function (ScheduleSubjectsService) {
              return ScheduleSubjectsService.query();
            }
          }
        });
    });

})();
