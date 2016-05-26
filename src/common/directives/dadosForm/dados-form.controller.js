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
    vm.block = 0;
    vm.completed = 0;
    vm.percCompleted = 0;
    vm.answers.order = 0;
    vm.answers.completed = 0;
    vm.prev = false;
    vm.answers.questionsSize = 0;
    vm.acum = 0;

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

      if (!block()) {
        vm.answers.order++;

        vm.prev = false;
        if (vm.form.questions[vm.currentQuestion].value !== vm.currentAnswer) {
          saveFormAnswers();
        }
        vm.currentQuestion++;

        vm.answers.n0 = vm.answers.acum + vm.percCompleted;

        if (vm.answers.completed === vm.answers.toComplete && vm.answers.order === vm.answers.questionsSize) {
          vm.answers.n0 = 100;
        }

        $scope.$broadcast('NextIndicator', vm.answers.n0);

        if (vm.currentQuestion >= vm.form.questions.length) {

          vm.currentQuestion = vm.form.questions.length - 1;

          if (vm.answers.completed === vm.answers.toComplete && vm.answers.order === vm.answers.questionsSize) {
            vm.answers.order = vm.answers.questionsSize - 1;
            vm.answers.n0 = 100;
          } else {
            vm.answers.order = 0;
          }

          vm.returned = false;

          $scope.$emit('NextFormRequest');
          vm.answers.id = vm.form.id;

        }
        vm.currentAnswer = vm.form.questions[vm.currentQuestion].value;
      }else if (block()) {
        vm.block--;
        if (vm.block < 0) {
          vm.block = 0;
        }
      }
    }

    /**
     * prevQuestion
     * @description Function for single question mode. Decrements the questions array index.
     *              Saves the answerSet if value was changed and sends PrevFormRequest
     *              to parent directive.
     */
    function prevQuestion() {
      vm.prev = true;
      if (vm.form.questions[vm.currentQuestion].value !== vm.currentAnswer) {
        saveFormAnswers();
      }

      vm.currentQuestion--;
      vm.block++;

      if (vm.currentQuestion < 0) {
        vm.currentQuestion = 0;
        vm.returned = true;

        $scope.$emit('PrevFormRequest');

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
     * IndicatorsSum
     * @description Event that fires from a given controller
     *              an Ordered Form array.
     */
    $scope.$on('IndicatorsSum', function(event, form) {
      vm.answers.toComplete = form.length;
      vm.answers.formOrder = form;

    });

    /**
     * $scope.$watch on dadosForm.form
     * @description Function sets up the form and tries to load answerSet if it was provided with id.
     */
    $scope.$watch('dadosForm.form', function(newForm, oldForm) {
      if (newForm && !_.isEqual(newForm, oldForm)) {

        vm.currentQuestion = 0;

        if (vm.prev === false && !block()) {

          if (vm.answers.order < vm.answers.questionsSize && vm.answers.order > 0) {
            vm.currentQuestion = vm.answers.order;
          }

          if (vm.answers.n0 > 0) {
            vm.answers.completed = Math.ceil(vm.answers.toComplete * (vm.answers.n0 / 100));
            vm.answers.acum = vm.answers.completed;
          }

          if (vm.answers.completed <= vm.answers.toComplete) {
            vm.answers.completed += 1;
          }

          if (vm.answers.completed > vm.answers.toComplete) {
            vm.answers.completed = vm.answers.toComplete;

          }

          var per2 = (vm.answers.completed) / vm.answers.toComplete * 100;

          vm.acum = per2 - vm.percCompleted;

          vm.answers.id = newForm.id;

          vm.answers.questionsSize = newForm.questions.length;

          vm.answers.acum = Math.floor(vm.acum / vm.answers.questionsSize);

          if (vm.form.questions[vm.currentQuestion].value !== vm.currentAnswer) {

            saveFormAnswers();
          }
        }

        if (vm.returned) {
          vm.currentQuestion = vm.form.questions.length - 1;
        }

        if (_.has(vm.form, 'answerSetID')) {
          AnswerSetService.get({id: vm.form.answerSetID}, function (data) {
            vm.answerSet = data.items;
            vm.answerSetID = vm.answerSet.id;
            vm.answers = vm.answerSet.answers;

            if (vm.answers.order !== undefined || vm.answers.order !== null) {
              vm.currentQuestion = vm.answers.order;
            } else {
              vm.currentQuestion = 0;
            }

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

      var t = vm.answers.formOrder.indexOf(vm.answers.id);

      if ((t - 1) > -1) {
        $scope.$emit('NextFormRequest', (t - 1));
      }

      $scope.$broadcast('NextIndicator', vm.answers.n0);

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

    /**
     * block
     * @description blocks completion indicator on prevQuestion
     */
    function block() {
      if (vm.block > 0) {

        return true;
      }else {

        return false;
      }
    }
  }
})();
