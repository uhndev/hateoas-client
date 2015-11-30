(function() {
  'use strict';

  angular
    .module('dados.subjectportal.studies.controller', [])
    .controller('SubjectPortalStudyController', SubjectPortalStudyController);

  SubjectPortalStudyController.$inject = [ 'ngTableParams', 'sailsNgTable', 'StudySubjectService' ];

  function SubjectPortalStudyController(TableParams, SailsNgTable, StudySubjectService) {
    var vm = this;

    // bindable variables
    vm.studyQuery = { 'where' : {} };
    vm.studySubjects = [];

    // bindable methods

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      vm.studyTableParams = new TableParams({
        page: 1,
        count: 10,
        sorting: { 'studyName': 'ASC' }
      }, {
        groupBy: 'studyName',
        getData: function($defer, params) {
          var api = SailsNgTable.parse(params, vm.studyQuery);
          StudySubjectService.query(api, function (resource) {
            angular.copy(resource, vm.studySubjects);
            params.total(resource.total);
            $defer.resolve(resource.items);
          });
        }
      });
    }
  }

})();
