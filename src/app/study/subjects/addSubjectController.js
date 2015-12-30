(function() {
  'use strict';

  angular
    .module('dados.study.subject.addSubject.controller', [])
    .controller('AddSubjectController', AddSubjectController);

  AddSubjectController.$inject = [
    '$uibModalInstance', 'study', 'centreHref', 'toastr', 'ProviderService', 'ENROLLMENT_STATUSES', 'SubjectEnrollmentService'
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
  function AddSubjectController($uibModalInstance, study, centreHref, toastr, Provider, ENROLLMENT_STATUSES, SubjectEnrollment) {
    var vm = this;
    // bindable variables
    vm.openedDOB = false;
    vm.openedDOE = false;
    vm.newSubject = { study: study.id };
    vm.study = study;
    vm.centreHref = centreHref;
    vm.statuses = ENROLLMENT_STATUSES;

    // bindable methods
    vm.addSubject = addSubject;
    vm.fetchProviders = fetchProviders;
    vm.cancel = cancel;

    ///////////////////////////////////////////////////////////////////////////

    function addSubject() {
      var enrollment = new SubjectEnrollment(vm.newSubject);
      enrollment.$save()
        .then(function() {
          toastr.success('Added subject to study!', 'Subject Enrollment');
        }).finally(function () {
          vm.newSubject = {};
          $uibModalInstance.close();
        });
    }

    function fetchProviders(query) {
      var queryObj = {};
      if (query) {
        query.displayName = { 'contains': query };
      }

      vm.providers = Provider.query(queryObj);
    }

    function cancel() {
      vm.newSubject = {};
      $uibModalInstance.dismiss('cancel');
    }
  }
})();
