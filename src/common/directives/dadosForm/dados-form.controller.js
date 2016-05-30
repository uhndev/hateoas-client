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
    vm.answers =
    {
      formOrder: [],
      formCompleted: [],
      order:0,
      questionsSize: 0,
      completed: 0,
      percCompleted: 0,
      totalPercentage: 0,
      acum: 0
    };
    vm.answerSet = {};
    vm.returned = false;
    vm.signed = false;
    vm.prev = false;
    vm.lockCompletionIndicator = false;
    vm.lockOrder = false;
    vm.lastForm = [];
    vm.lastQuestion = 0;
    vm.isCompleted = false;
    vm.nextForm = false;
    vm.formCompleted = [];
    vm.acum = 0;
    vm.addLast = 0;

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

      vm.prev = false;

      if (vm.form.questions[vm.currentQuestion].value !== vm.currentAnswer) {
        saveFormAnswers();
      }
      vm.currentQuestion++;

      if (vm.lockCompletionIndicator === false) {

        vm.answers.order++;
        calculateCompletionIndicator(vm.form);

        if (vm.lockOrder === false && vm.answers.completed === vm.answers.toComplete && vm.answers.order === vm.answers.questionsSize) {
          vm.isCompleted = true;
          vm.answers.totalPercentage = 100;
        }else if (vm.lockOrder === true && vm.answers.completed === vm.answers.toComplete && vm.lastQuestion + 1 === vm.answers.questionsSize) {
          vm.isCompleted = true;
          vm.answers.totalPercentage = 100;
          vm.lockOrder = false;
        }else {
          //adds question percentage to total percentage
          vm.answers.totalPercentage = vm.answers.acum + vm.percCompleted;
        }

        $scope.$broadcast('NextIndicator', vm.answers.totalPercentage);

        nextForm();

      }else if (vm.lockCompletionIndicator === true) {
        nextForm();
      }
    }

    /**
     * nextForm
     * @description Function for next Form
     */
    function nextForm() {

      if (_.inArray(vm.lastForm, vm.form.id) && vm.currentQuestion === vm.lastQuestion) {
        vm.lockCompletionIndicator = false;
        vm.addLast = 0;
        vm.lockOrder = true;
      }

      if (vm.currentQuestion >= vm.form.questions.length) {

        vm.currentQuestion = vm.form.questions.length - 1;
        // if inquiry is completed the question order will be questionsize-1
        if (vm.isCompleted) {
          vm.answers.order = vm.answers.questionsSize - 1;
          vm.isCompleted = false;
        }else {
          vm.answers.order = 0;
        }
        vm.returned = false;
        $scope.$emit('NextFormRequest');
        vm.answers.id = vm.form.id;
        vm.nextForm = true;

      }else {
        vm.nextForm = false;
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
      vm.prev = true;
      if (vm.form.questions[vm.currentQuestion].value !== vm.currentAnswer) {
        saveFormAnswers();
      }

      vm.lockCompletionIndicator = true;
      if (vm.addLast === 0) {
        vm.addLast++;
        vm.lastForm.push(vm.form.id);
        vm.lastQuestion = vm.currentQuestion;
      }

      vm.currentQuestion--;

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
     * calculateCompletionIndicator
     * @description calculates the total percentage and percentage per question
     */
    function calculateCompletionIndicator(newForm) {

      //verifies the current question order and associate the new order
      if (vm.answers.order < vm.answers.questionsSize && vm.answers.order > 0) {
        vm.currentQuestion = vm.answers.order;
      }
      //verifies the current total percentage is > 0 and calculate the total percentage
      if (vm.answers.totalPercentage > 0) {
        vm.answers.completed = Math.ceil(vm.answers.toComplete * (vm.answers.totalPercentage / 100));
        // associate question percentage to total percentage
        vm.answers.acum = vm.answers.completed;
      }
      //control forms completed
      if (!_.inArray(vm.answers.formCompleted, newForm.id)) {
        vm.answers.formCompleted.push(newForm.id);
      }

      vm.answers.completed = vm.answers.formCompleted.length;

      //calculates the nominal percentage position
      var per2 = (vm.answers.completed) / vm.answers.toComplete * 100;

      //difference of the total nominal percentage with the total real percentage
      vm.acum = per2 - vm.percCompleted;

      //associate the actual form id
      vm.answers.id = newForm.id;

      //associate the question size
      vm.answers.questionsSize = newForm.questions.length;

      // calculates the real percentage per question
      vm.answers.acum = Math.floor(vm.acum / vm.answers.questionsSize);

    }

    /**
     * $scope.$watch on dadosForm.form
     * @description Function sets up the form and tries to load answerSet if it was provided with id.
     */
    $scope.$watch('dadosForm.form', function(newForm, oldForm) {
      if (newForm && !_.isEqual(newForm, oldForm)) {

        vm.currentQuestion = 0;

        if (vm.prev === false && vm.lockCompletionIndicator === false) {

          calculateCompletionIndicator(newForm);

          //saves
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

      //returns the order index of the last form completed
      var orderIndex = vm.answers.formOrder.indexOf(_.last(vm.answers.formCompleted));

      if ((orderIndex - 1) > -1) {
        $scope.$emit('NextFormRequest', (orderIndex - 1));
      }

      $scope.$broadcast('NextIndicator', vm.answers.totalPercentage);

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
