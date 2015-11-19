(function() {
  'use strict';

  angular
    .module('dados.subjectportal.controller', [])
    .controller('SubjectPortalController', SubjectPortalController);

  SubjectPortalController.$inject = ['ngTableParams', 'StudySubjects', 'SubjectSchedules'];

  function SubjectPortalController(TableParams, StudySubjects, SubjectSchedules) {
    var vm = this;

    vm.studySubjects = StudySubjects;
    vm.subjectSchedules = SubjectSchedules;

    vm.tableParams = new TableParams({
      page: 1,
      count: 10
    }, {
      data: StudySubjects
    });

  }

})();
