(function() {
  'use strict';

  angular
    .module('dados.subjectportal.controller', [])
    .controller('SubjectPortalController', SubjectPortalController);

  SubjectPortalController.$inject = [ 'ngTableParams', 'sailsNgTable', 'StudySubjectService', 'ScheduleSubjectsService' ];

  function SubjectPortalController(TableParams, SailsNgTable, StudySubjects, ScheduleSubjects) {
    var vm = this;

    // bindable variables
    vm.scheduleQuery = { 'where' : {} };
    vm.studyQuery = { 'where': {} };
    vm.scheduleSubjects = [];
    vm.studySubjects = [];

    // bindable methods

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      vm.studyTableParams = getPortalTable('study');
      vm.scheduleTableParams = getPortalTable('schedule');
    }

    function getPortalTable(type) {
      var settings = {};
      settings.query = (type == 'study') ? vm.studyQuery : vm.scheduleQuery;
      settings.resource = (type == 'study') ? StudySubjects : ScheduleSubjects;
      settings.value = (type == 'study') ? vm.studySubjects : vm.scheduleSubjects;

      return new TableParams({
        page: 1,
        count: 10,
        sorting: { 'studyName': 'ASC' }
      }, {
        groupBy: 'studyName',
        getData: function($defer, params) {
          var api = SailsNgTable.parse(params, (type == 'study') ? vm.studyQuery : vm.scheduleQuery);
          settings.resource.query(api, function (resource) {
            settings.value = angular.copy(resource);
            params.total(resource.total);
            $defer.resolve(resource.items);
          });
        }
      });
    }
  }

})();
