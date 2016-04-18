(function() {
  'use strict';

  angular
    .module('dados.subjectportal.profile.controller', [])
    .controller('SubjectPortalProfileController', SubjectPortalProfileController);

  SubjectPortalProfileController.$inject = ['ngTableParams', 'sailsNgTable', 'StudySubjectService', 'UserService', 'AuthService'];

  function SubjectPortalProfileController(TableParams, SailsNgTable, StudySubjectService, UserService, Auth) {
    var vm = this;

    // bindable variables
    vm.openedDOB = false;
    vm.studyQuery = {'where' : {}};
    vm.studySubjects = [];

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      UserService.get({id: Auth.currentUser.id}).$promise.then(function (user) {
        if (_.isUndefined(user.dob)) {
          delete user.dob;
        } else {
          if (angular.isString(user.dob)) {
            user.dob = new Date(user.dob);
          }
        }
        vm.user = angular.copy(user);
      });

      vm.studyTableParams = new TableParams({
        page: 1,
        count: 10,
        sorting: {'studyName': 'ASC'}
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
