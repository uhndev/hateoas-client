(function() {
  'use strict';

  angular
    .module('dados.study.survey.addSurvey.controller', [])
    .controller('AddSurveyController', AddSurveyController);

  AddSurveyController.$inject = [
    '$uibModalInstance', 'toastr', 'study', 'forms', 'SurveyService'
  ];

  function AddSurveyController($uibModalInstance, toastr, study, forms, Survey) {
    var vm = this;

    // bindable variables
    vm.study = study;
    vm.forms = forms;
    vm.newSurvey = {study: study.id};
    vm.saving = false;

    // bindable methods
    vm.save = save;
    vm.cancel = cancel;

    ///////////////////////////////////////////////////////////////////////////

    function save() {
      vm.saving = true;
      var survey = new Survey(vm.newSurvey);
      survey.$save()
        .then(function() {
          toastr.success('Added survey to study!', 'Survey');
        }).finally(function () {
          vm.newSurvey = {};
          $uibModalInstance.close();
        });
    }

    function cancel() {
      vm.newSurvey = {};
      $uibModalInstance.dismiss('cancel');
    }
  }
})();
