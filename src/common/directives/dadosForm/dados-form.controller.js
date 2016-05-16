(function () {
  'use strict';

  angular
    .module('dados.common.directives.dadosForm.controller', [
      'dados.common.directives.dadosForm.service'
    ])
    .controller('DadosFormController', DadosFormController);

  DadosFormController.$inject = ['$scope', 'AnswerSetService'];

  function DadosFormController($scope, AnswerSetService) {
    var vm = this;

    // bindable variables
    vm.answers = {};
    vm.answerSet = {};
    vm.returned = false;
    vm.signed = false;

    if (!vm.mode) {
      vm.mode = 'multi';
    }

    // bindable methods
    vm.saveFormAnswers = saveFormAnswers;
    vm.signForm = signForm;
    vm.revokeForm = revokeForm;
    vm.hasAnswers = hasAnswers;
    vm.updateAnswers = updateAnswers;
    vm.nextQuestion = nextQuestion;
    vm.prevQuestion = prevQuestion;

    /**
     * nextQuestion
     * @description Function for single question mode. Increments the questions array index.
     *              Saves the answerSet if value was changed and sends NextFormRequest
     *              to parent directive.
     */
    function nextQuestion() {
      if (vm.form.questions[vm.currentQuestion].value !== vm.currentAnswer) {
        saveFormAnswers();
      }

      vm.currentQuestion++;

      if (vm.currentQuestion >= vm.form.questions.length) {

        vm.currentQuestion = vm.form.questions.length - 1;
        vm.returned = false;
        $scope.$emit('NextFormRequest');
        $scope.$broadcast('NextIndicator');
      }
      vm.currentAnswer = vm.form.questions[vm.currentQuestion].value;

    }

    /**
     * prevQuestion
     * @description Function for single question mode. Decrements the questions array index.
     *              Saves the answerSet if value was changed and sends PrevFormRequest
     *              to parent directive.
     */
    function prevQuestion() {
      if (vm.form.questions[vm.currentQuestion].value !== vm.currentAnswer) {
        saveFormAnswers();
      }

      vm.currentQuestion--;

      if (vm.currentQuestion < 0) {
        vm.currentQuestion = 0;
        vm.returned = true;
        $scope.$emit('PrevFormRequest');
        $scope.$broadcast('PrevIndicator');

      }
      vm.currentAnswer = vm.form.questions[vm.currentQuestion].value;
    }

    /**
     * saveFormAnswers
     * @description Updates or creates the answerset
     */
    function saveFormAnswers() {
      if (vm.signed) {
        return;
      }

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
     * signForm
     * @description Locks completed form
     */
    function signForm() {
      updateAnswers();

      if (angular.isDefined(vm.answerSetID)) {
        vm.signed = true;

        AnswerSetService.save({
          answers: vm.answers,
          id: vm.answerSetID,
          signed: true
        });
      }
    }

    /**
     * revokeForm
     * @description Expires the old answerSet
     */
    function revokeForm() {
      AnswerSetService.save({
        answers: vm.answers,
        scheduleID: vm.form.scheduleID,
        formID: vm.form.id,
      }, onAnswerSetRevoked);
    }

    /**
     * hasAnswers
     * @description Checks if current form has answers
     */
    function hasAnswers() {
      return !_.isEmpty(vm.answers);
    }

    /**
     * onAnswerSetCreated
     * @description Callback that updates current answerSet id if it was succesfully created
     */
    function onAnswerSetCreated(result) {
      if (angular.isDefined(result.id)) {
        vm.answerSetID = result.id;
      }
    }

    /**
     * onAnswerSetRevoked
     * @description Callback that updates current id and unlocks the form if revoke was successful
     */
    function onAnswerSetRevoked(result) {
      if (angular.isDefined(result.id)) {
        vm.answerSetID = result.id;
        vm.signed = false;
      }
    }

    /**
     * updateAnswers
     * @description This function iterates through questions and updates answers array
     */
    function updateAnswers() {
      _.each(vm.form.questions, function (question) {
        if (angular.isDefined(question.value)) {
          vm.answers[question.name] = question.value;
        }
      });
    }

    /**
     * $scope.$watch on dadosForm.form
     * @description Function sets up the form and tries to load answerSet if it was provided with id.
     */
    $scope.$watch('dadosForm.form', function(newForm, oldForm) {
      if (newForm && !_.isEqual(newForm, oldForm)) {
        if (vm.returned) {
          vm.currentQuestion = vm.form.questions.length - 1;
        } else {
          vm.currentQuestion = 0;
        }

        if (_.has(vm.form, 'answerSetID')) {
          AnswerSetService.get({id: vm.form.answerSetID}, function (data) {
            vm.answerSet = data.items;
            vm.answerSetID = vm.answerSet.id;
            vm.answers = vm.answerSet.answers;

            if (_.isBoolean(vm.answerSet.signed)) {
              vm.signed = vm.answerSet.signed;
            }
            // notify that answers array was updated
            $scope.$broadcast('AnswerSetLoaded');
          });
        } else {
          // reset answerSet anyway in case answerSetID is not set
          vm.answerSet = {};
        }
      }
    });

    /**
     * AnswerSetLoaded
     * @description Event that fires when answerSet was reloaded.
     *              Updates the question values accordingly.
     */
    $scope.$on('AnswerSetLoaded', function (e) {
      _.each(vm.answers, function (answer, name) {

        var question = _.find(vm.form.questions, function (q) {
          return q.name == name;
        });

        if (question !== undefined) {
          question.value = answer;
        }
      });

      vm.currentAnswer = vm.form.questions[vm.currentQuestion].value;
    });

  }
})();
