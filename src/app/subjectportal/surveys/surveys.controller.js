(function() {
  'use strict';

  angular
    .module('dados.subjectportal.surveys.controller', [])
    .controller('SubjectPortalScheduleController', SubjectPortalScheduleController);

  SubjectPortalScheduleController.$inject = ['$state', 'ngTableParams', 'sailsNgTable', 'ScheduleSubjectService'];

  function SubjectPortalScheduleController($state, TableParams, SailsNgTable, ScheduleSubjectService) {
    var vm = this;

    // bindable variables
    vm.scheduleQuery = {'where' : {}};
    vm.scheduleSubjects = [];

    // bindable methods
    vm.openSession = openSession;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      vm.scheduleTableParams = new TableParams({
        page: 1,
        count: 10,
        sorting: {'studyName': 'ASC'}
      }, {
        groupBy: 'studyName',
        getData: function($defer, params) {
          var api = SailsNgTable.parse(params, vm.scheduleQuery);
          ScheduleSubjectService.query(api, function (resource) {
            angular.copy(resource, vm.scheduleSubjects);
            params.total(resource.total);
            $defer.resolve(resource.items);
          });
        }
      });
    }

    function openSession(schedule, session) {
      $state.go('subjectportal.forms', {sessionID : session, scheduleID : schedule});
    }
  }

})();
