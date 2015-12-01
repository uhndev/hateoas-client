(function() {
  'use strict';

  angular
    .module('dados.subjectportal.profile.controller', [])
    .controller('SubjectPortalProfileController', SubjectPortalProfileController);

  SubjectPortalProfileController.$inject = [ 'toastr', 'ngTableParams', 'sailsNgTable', 'StudySubjectService', 'UserService', 'AuthService' ];

  function SubjectPortalProfileController(toastr, TableParams, SailsNgTable, StudySubjectService, UserService, Auth) {
    var vm = this;

    // bindable variables
    vm.openedDOB = false;
    vm.user = UserService.get({ id: Auth.currentUser.user.id });
    vm.studyQuery = { 'where' : {} };
    vm.studySubjects = [];

    // bindable methods
    vm.openDOB = openDOB;
    vm.updateUser = updateUser;

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

    function openDOB($event) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.openedDOB = true;
    }

    function updateUser() {
      var user = new UserService(vm.user);
      user.$update({ id: vm.user.id })
        .then(function() {
          toastr.success('Updated profile!', 'User Profile');
        })
        .finally(function () {
          delete vm.user.password;
        });
    }

  }

})();
