(function() {
  'use strict';

  angular
    .module('dados.subjectportal.controller', [])
    .controller('SubjectPortalController', SubjectPortalController);

  SubjectPortalController.$inject = [ 'ngTableParams', 'sailsNgTable', 'StudySubjectService', 'ScheduleSubjectsService' ];

  function SubjectPortalController(TableParams, SailsNgTable, StudySubjects, ScheduleSubjects) {
    var vm = this;

    vm.scheduleQuery = { 'where' : {} };
    vm.studyQuery = { 'where': {} };
    vm.scheduleSubjects = [];
    vm.studySubjects = [];

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {

      vm.studyTableParams = new TableParams({
        page: 1,
        count: 10,
        sorting: { 'studyName': 'ASC' }
      }, {
        groupBy: "studyName",
        getData: function($defer, params) {
          var api = SailsNgTable.parse(params, vm.studyQuery);
          StudySubjects.query(api,function (studySubjects) {
            vm.studySubjects = angular.copy(studySubjects.items);
            params.total(studySubjects.total);
            $defer.resolve(studySubjects.items);
          });
        }
      });

      vm.scheduleTableParams = new TableParams({
        page: 1,
        count: 10,
        sorting: { 'studyName': 'ASC' }
      }, {
        groupBy: "studyName",
        getData: function($defer, params) {
          var api = SailsNgTable.parse(params, vm.scheduleQuery);
          ScheduleSubjects.query(api, function (scheduleSubjects) {
            vm.scheduleSubjects = angular.copy(scheduleSubjects.items);
            params.total(scheduleSubjects.total);
            $defer.resolve(scheduleSubjects.items);
          });
        }
      });
    }
  }

})();
