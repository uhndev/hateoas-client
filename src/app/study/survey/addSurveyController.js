(function() {
  'use strict';

  angular
    .module('dados.study.survey.addSurvey.controller', [])
    .controller('AddSurveyController', AddSurveyController);

  AddSurveyController.$inject = [
    '$modalInstance', 'toastr', 'study', 'forms', 'SurveyService'
  ];

  function AddSurveyController($modalInstance, toastr, study, forms, Survey) {
    var vm = this;

    // bindable variables
    vm.study = study;
    vm.forms = forms;
    vm.newSurvey = { study: study.id };
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
          $modalInstance.close();
        });
    }

    function cancel() {
      vm.newSurvey = {};
      $modalInstance.dismiss('cancel');
    }
  }
})();
