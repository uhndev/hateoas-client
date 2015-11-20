(function() {
  'use strict';

  angular
    .module('dados.subjectportal.controller', [])
    .controller('SubjectPortalController', SubjectPortalController);

  SubjectPortalController.$inject = ['StudySubjects', 'ScheduleSubjects'];

  function SubjectPortalController(StudySubjects, ScheduleSubjects) {
    var vm = this;

    vm.studySubjects = StudySubjects;
    vm.scheduleSubjects = ScheduleSubjects;

  }

})();
