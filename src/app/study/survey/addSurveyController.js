(function() {
  'use strict';

  angular
    .module('dados.study.survey.addSurvey.controller', [])
    .controller('AddSurveyController', AddSurveyController);

  AddSurveyController.$inject = [
    '$modalInstance', 'toastr', 'study', 'SurveyService'
  ];

  function AddSurveyController($modalInstance, toastr, study, Survey) {
    var vm = this;

    // bindable variables
    vm.newSurvey = { study: study.id };

    // bindable methods
    vm.save = save;
    vm.cancel = cancel;

    ///////////////////////////////////////////////////////////////////////////

    function save() {
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
