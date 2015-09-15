(function() {
  'use strict';

  angular
    .module('dados.study.survey.editSurvey.controller', [])
    .controller('EditSurveyController', EditSurveyController);

  EditSurveyController.$inject = [
    '$modalInstance', 'toastr', 'study', 'forms', 'survey', 'SurveyService'
  ];

  function EditSurveyController($modalInstance, toastr, study, forms, survey, Survey) {
    var vm = this;

    // bindable variables
    vm.study = study || {};
    vm.forms = forms || [];
    vm.editSurvey = survey || {};
    vm.isValid = false;

    // bindable methods
    vm.save = save;
    vm.cancel = cancel;

    ///////////////////////////////////////////////////////////////////////////

    function save() {
      var enrollment = new Survey(vm.editSurvey);
      enrollment
        .$update({ id: survey.id })
        .then(function() {
          toastr.success('Updated survey!', 'Survey');
        })
        .finally(function () {
          vm.editSurvey = {};
          $modalInstance.close();
        });
    }

    function cancel() {
      vm.editSurvey = {};
      $modalInstance.dismiss('cancel');
    }
  }
})();
