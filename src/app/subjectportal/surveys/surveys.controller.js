(function() {
  'use strict';

  angular
    .module('dados.subjectportal.surveys.controller', [])
    .controller('SubjectPortalScheduleController', SubjectPortalScheduleController);

  SubjectPortalScheduleController.$inject = ['ngTableParams', 'sailsNgTable', 'ScheduleSubjectService'];

  function SubjectPortalScheduleController(TableParams, SailsNgTable, ScheduleSubjectService) {
    var vm = this;

    // bindable variables
    vm.scheduleQuery = {'where' : {}};
    vm.scheduleSubjects = [];

    // bindable methods

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
  }

})();
