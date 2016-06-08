(function() {
  'use strict';

  angular
    .module('dados.study.subject.addSubject.controller', [])
    .controller('AddSubjectController', AddSubjectController);

  AddSubjectController.$inject = [
    '$uibModalInstance', 'study', 'centreHref', 'toastr', 'ENROLLMENT_STATUSES', 'StudyUserService', 'SubjectEnrollmentService'
  ];

  /**
   * AddSubjectController

   * @description Controller for the add subject to study modal window.
   * @param $uibModalInstance
   * @param study               resolved study response passed in from subjectViewController.js
   * @param centreHref          resolved url /study/<STUDY>/collectioncentre used for selectLoader dropdown
   * @param toastr
   * @param ENROLLMENT_STATUSES constants used in status dropdowns, defined in subject.constant.js
   * @param SubjectEnrollment
   * @constructor
   */
  function AddSubjectController($uibModalInstance, study, centreHref, toastr, ENROLLMENT_STATUSES, StudyUser, SubjectEnrollment) {
    var vm = this;
    // bindable variables
    vm.openedDOB = false;
    vm.openedDOE = false;
    vm.newSubject = {study: study.id};
    vm.study = study;
    vm.centreHref = centreHref;
    vm.view = false;
    vm.statuses = ENROLLMENT_STATUSES;
    StudyUser.query({studyID: study.id}).$promise.then(function (data) {
      vm.studyUsers = {user: _.pluck(data, 'id')};
    });

    // bindable methods
    vm.addSubject = addSubject;
    vm.cancel = cancel;
    vm.checked = checked;

    ///////////////////////////////////////////////////////////////////////////

    /**
         * addSubject
         * @description Click handler for creating a subject enrollment in the study
         */
    function addSubject() {

      if (!_.isEmpty(vm.newSubject.subject)) {
        var existentSubject = _.pick(vm.newSubject.subject[0], 'id', 'user');
        delete vm.newSubject.subject;
        vm.newSubject.subject = existentSubject;
      }

      var enrollment = new SubjectEnrollment(vm.newSubject);
      enrollment.$save()
        .then(function() {
          toastr.success('Added subject to study!', 'Subject Enrollment');
        }).finally(function () {
          vm.newSubject = {};
          $uibModalInstance.close();
        });
    }

    /**
         * cancel
         * @description Closes addSubject modal window
         */
    function cancel() {
      vm.newSubject = {};
      $uibModalInstance.dismiss('cancel');
    }

    function checked() {
      if (vm.view) {
        vm.view = false;
      }else {
        vm.view = true;
      }
    }
  }
})();
