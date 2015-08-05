(function() {
  'use strict';

  angular
    .module('dados.study.subject.editSubject.controller', [
      'ui.bootstrap'
    ])
    .controller('EditSubjectController', EditSubjectController);

  EditSubjectController.$inject = [
    '$modalInstance', 'subject', 'study', 'centreHref', 'toastr', 'SubjectEnrollmentService', 'UserService'
  ];

  function EditSubjectController($modalInstance, subject, study, centreHref, toastr, SubjectEnrollment, User) {
    var vm = this;
    // bindable variables
    vm.openedDOE = false;
    vm.newSubject = subject || {};
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
    vm.openDOE = openDOE;
    vm.editSubject = editSubject;
    vm.cancel = cancel;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      User.get({ id: subject.userId }, function (data, headers) {
        vm.userData = angular.copy(data.items);
      });
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
        .then(user.$update({ id: subject.userId }))
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
