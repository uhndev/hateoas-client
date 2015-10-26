(function() {
  'use strict';

  angular
    .module('dados.study.subject.editSubject.controller', [])
    .controller('EditSubjectController', EditSubjectController);

  EditSubjectController.$inject = [
    '$modalInstance', 'subject', 'study', 'centreHref', 'toastr',
    'ENROLLMENT_STATUSES', 'SubjectEnrollmentService', 'UserService'
  ];

  /**
   * EditSubjectController

   * @description Controller for the edit subject in study modal window.
   * @param $modalInstance
   * @param subject             resolved subject response to edit passed in from subjectViewController.js
   * @param study               resolved study response passed in from subjectViewController.js
   * @param centreHref          resolved url /study/<STUDY>/collectioncentre used for selectLoader dropdown
   * @param toastr
   * @param ENROLLMENT_STATUSES constants used in status dropdowns, defined in subject.constant.js
   * @param SubjectEnrollment
   * @param User
   * @constructor
   */
  function EditSubjectController($modalInstance, subject, study, centreHref, toastr,
                                 ENROLLMENT_STATUSES, SubjectEnrollment, User) {
    var vm = this;
    // bindable variables
    vm.openedDOB = false;
    vm.openedDOE = false;
    vm.userData = {};
    vm.newSubject = subject || {};
    vm.study = study;
    vm.centreHref = centreHref;
    vm.statuses = ENROLLMENT_STATUSES;

    // bindable methods
    vm.openDOB = openDOB;
    vm.openDOE = openDOE;
    vm.editSubject = editSubject;
    vm.cancel = cancel;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      User.get({ id: subject.user }, function (data, headers) {
        if (data) {
          vm.userData = angular.copy(data);
        }
      });
    }

    function openDOB($event) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.openedDOB = true;
    }

    function openDOE($event) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.openedDOE = true;
    }

    function editSubject() {
      var user = new User(vm.userData);
      var enrollment = new SubjectEnrollment(vm.newSubject);
      enrollment
        .$update({ id: subject.id })
        .then(user.$update({ id: subject.user }))
        .then(function() {
          toastr.success('Updated subject enrollment!', 'Subject Enrollment');
        })
        .finally(function () {
          vm.newSubject = {};
          vm.userData = {};
          $modalInstance.close();
        });
    }

    function cancel() {
      vm.newSubject = {};
      vm.userData = {};
      $modalInstance.dismiss('cancel');
    }
  }
})();
