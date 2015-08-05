(function() {
  'use strict';

  angular
    .module('dados.study.subject.addSubject.controller', [
      'ui.bootstrap'
    ])
    .controller('AddSubjectController', AddSubjectController);

  AddSubjectController.$inject = [
    '$modalInstance', 'study', 'centreHref', 'toastr', 'SubjectEnrollmentService'
  ];

  function AddSubjectController($modalInstance, study, centreHref, toastr, SubjectEnrollment) {
    var vm = this;
    // bindable variables
    vm.openedDOB = false;
    vm.openedDOE = false;
    vm.newSubject = { study: study.id };
    vm.study = study;
    vm.centreHref = centreHref;
    vm.statuses = [
      'REGISTERED',
      'ONGOING',
      'LOST TO FOLLOWUP',
      'WITHDRAWN',
      'INELIGIBLE',
      'DECEASED',
      'TERMINATED',
      'COMPLETED'
    ];

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
