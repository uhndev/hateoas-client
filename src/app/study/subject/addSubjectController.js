(function() {
  'use strict';

  angular
    .module('dados.study.subject.addSubject.controller', [])
    .controller('AddSubjectController', AddSubjectController);

  AddSubjectController.$inject = [
    '$modalInstance', 'study', 'centreHref', 'toastr', 'ENROLLMENT_STATUSES', 'SubjectEnrollmentService'
  ];

  /**
   * AddSubjectController

   * @description Controller for the add subject to study modal window.
   * @param $modalInstance
   * @param study               resolved study response passed in from subjectViewController.js
   * @param centreHref          resolved url /study/<STUDY>/collectioncentre used for selectLoader dropdown
   * @param toastr
   * @param ENROLLMENT_STATUSES constants used in status dropdowns, defined in subject.constant.js
   * @param SubjectEnrollment
   * @constructor
   */
  function AddSubjectController($modalInstance, study, centreHref, toastr, ENROLLMENT_STATUSES, SubjectEnrollment) {
    var vm = this;
    // bindable variables
    vm.openedDOB = false;
    vm.openedDOE = false;
    vm.newSubject = { study: study.id };
    vm.study = study;
    vm.centreHref = centreHref;
    vm.statuses = ENROLLMENT_STATUSES;

    // bindable methods
    vm.openDOB = openDOB;
    vm.openDOE = openDOE;
    vm.addSubject = addSubject;
    vm.cancel = cancel;

    ///////////////////////////////////////////////////////////////////////////

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

    function addSubject() {
      var enrollment = new SubjectEnrollment(vm.newSubject);
      enrollment.$save()
        .then(function() {
          toastr.success('Added subject to study!', 'Subject Enrollment');
        }).finally(function () {
          vm.newSubject = {};
          $modalInstance.close();
        });
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
})();
