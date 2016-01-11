(function() {
  'use strict';

  angular
    .module('dados.study.subject.editSubject.controller', [])
    .controller('EditSubjectController', EditSubjectController);

  EditSubjectController.$inject = [
    '$uibModalInstance', 'subject', 'study', 'centreHref', 'toastr',
    'ENROLLMENT_STATUSES', 'SubjectEnrollmentService', 'UserService', 'StudyUserService'
  ];

  /**
   * EditSubjectController

   * @description Controller for the edit subject in study modal window.
   * @param $uibModalInstance
   * @param subject             resolved subject response to edit passed in from subjectViewController.js
   * @param study               resolved study response passed in from subjectViewController.js
   * @param centreHref          resolved url /study/<STUDY>/collectioncentre used for selectLoader dropdown
   * @param toastr
   * @param ENROLLMENT_STATUSES constants used in status dropdowns, defined in subject.constant.js
   * @param SubjectEnrollment
   * @param User
   * @constructor
   */
  function EditSubjectController($uibModalInstance, subject, study, centreHref, toastr,
                                 ENROLLMENT_STATUSES, SubjectEnrollment, User, StudyUser) {
    var vm = this;
    // bindable variables
    vm.openedDOB = false;
    vm.openedDOE = false;
    vm.userData = {};
    vm.newSubject = subject;
    vm.study = study;
    vm.centreHref = centreHref;
    vm.statuses = ENROLLMENT_STATUSES;
    StudyUser.query({ studyID: study.id }).$promise.then(function (data) {
      vm.studyUsers = { user: _.pluck(data, 'id') };
    });

    // bindable methods
    vm.editSubject = editSubject;
    vm.cancel = cancel;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      if (!_.isArray(vm.newSubject.providers)) {
        vm.newSubject.providers = [vm.newSubject.providers];
      }

      User.get({ id: subject.user }, function (data, headers) {
        if (data) {
          if (_.isUndefined(data.dob)) {
            delete data.dob;
          } else {
            if (angular.isString(data.dob)) {
              data.dob = new Date(data.dob);
            }
          }
          vm.userData = angular.copy(data);
        }
      });
    }

	  /**
     * editSubject
     * @description Click handler for editing a subject enrollment in a study
     */
    function editSubject() {
      var user = new User(vm.userData);
      var enrollment = new SubjectEnrollment(vm.newSubject);
      enrollment
        .$update({ id: subject.id })
        .then(function() {
          return user.$update({ id: subject.user });
        })
        .then(function() {
          toastr.success('Updated subject enrollment!', 'Subject Enrollment');
        })
        .finally(function () {
          vm.newSubject = {};
          vm.userData = {};
          $uibModalInstance.close();
        });
    }

    /**
     * cancel
     * @description Closes addSubject modal window
     */
    function cancel() {
      vm.newSubject = {};
      vm.userData = {};
      $uibModalInstance.dismiss('cancel');
    }
  }
})();
