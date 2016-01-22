(function () {
  'use strict';

  angular
    .module('dados.common.directives.dadosForm.controller', [
      'dados.common.directives.dadosForm.service'
    ])
    .controller('DadosFormController', DadosFormController);

  DadosFormController.$inject = ['$scope', '$location', '$timeout', 'AnswerSetService'];

  function DadosFormController($scope, $location, $timeout, AnswerSetService) {
    var vm = this;

    // bindable variables
    vm.answers = {};
    vm.answerSet = {};

    // bindable methods
    vm.saveFormAnswers = saveFormAnswers;
    vm.updateAnswers = updateAnswers;

    /**
     * saveFormAnswers
     * @description Updates or creates the answerset
     */
    function saveFormAnswers() {
      updateAnswers();

      if (angular.isDefined(vm.answerSetID)) {
        AnswerSetService.save({
          answers: vm.answers,
          id: vm.answerSetID
        });
      } else {
        AnswerSetService.save({
          answers: vm.answers,
          scheduleID: vm.form.scheduleID,
          formID: vm.form.id,
        }, onAnswerSetCreated);
      }
    }

    /**
     * onAnswerSetCreated
     * @description Callback that updates current answerSet id if it was succesfully created
     */
    function onAnswerSetCreated(result) {
      console.log('AnswerSet created');
      console.log(result);
      if (angular.isDefined(result.id)) {
        vm.answerSetID = result.id;
      }
    }

    /**
     * updateAnswers
     * @description This function iterates through questions and updates answers array
     */
    function updateAnswers() {
      _.each(vm.questions, function (question) {
        if (angular.isDefined(question.value)) {
          vm.answers[question.name] = question.value;
        }
      });
    }

    /**
     * FormLoaded
     * @description Event that is fired from parent controller on initial form load.
     *              Function sets up the form and tries to load answerSet if it was provided with id.
     */
    $scope.$on('FormLoaded', function (e, form) {
      vm.form = form;
      vm.questions = form.questions;
      if (_.has(form, 'answerSetID')) {
        vm.answerSetID = form.answerSetID;

        AnswerSetService.get({id: vm.answerSetID}, function (data) {
          vm.answerSet = data.items;
          vm.answers = vm.answerSet.answers;
          $scope.$broadcast('AnswerSetLoaded');
        });
      }
    });

    /**
     * AnswerSetLoaded
     * @description Event that fires when answerSet was reloaded.
     *              Updates the question values accordingly.
     */
    $scope.$on('AnswerSetLoaded', function (e) {
      _.each(vm.answers, function (answer, name) {

        var question = _.find(vm.questions, function (q) {
          return q.name == name;
        });
        if (question !== undefined) {
          question.value = answer;
        }
      });
    });

  }
})();
