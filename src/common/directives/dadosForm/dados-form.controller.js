(function(){
  'use strict';

  angular
    .module('dados.common.directives.dadosForm.controller', [
      'dados.common.directives.dadosForm.service'
    ])
    .controller('DadosFormController', DadosFormController);

  DadosFormController.$inject = ['$scope', '$location', '$timeout', 'AnswerSetService'];

  function DadosFormController($scope, $location, $timeout, AnswerSetService) {
    var vm = this;
    
    $scope.answers = {};
    $scope.answerSet = {};
    $scope.saveFormAnswers = saveFormAnswers;
    $scope.updateAnswers = updateAnswers;

    /**
     * saveFormAnswers
     * @description Updates or creates the answerset
     */
    function saveFormAnswers() {
      updateAnswers();
      
      if (angular.isDefined($scope.answerSetID)) {
        AnswerSetService.save({
          answers : $scope.answers,
          id : $scope.answerSetID
        });
      } else {
        AnswerSetService.save({
          answers : $scope.answers,
          subjectEnrollmentID : $scope.form.subjectEnrollmentID,
          sessionID : $scope.form.sessionID,
          scheduleID : $scope.form.scheduleID,
          formID : $scope.form.id,
        }, onAnswerSetCreated);
      }
    }

    function onAnswerSetCreated(result) {
      console.log("AnswerSet created");
      console.log(result);
      if (angular.isDefined(result.id)) {
        $scope.answerSetID = result.id;
      }
    }
    
    function updateAnswers() {
      _.each($scope.questions, function(question) {
        if (angular.isDefined(question.value)) {
          $scope.answers[question.name] = question.value;
        }
      });
      console.log($scope.answers);
    }

    $scope.$on('FormLoaded', function (e, form) {
      $scope.form = form;
      $scope.questions = form.questions;
      if (_.has(form, 'answerSetID')) {
        $scope.answerSetID = form.answerSetID;
        console.log($scope.answerSetID);
        
        AnswerSetService.get({id: $scope.answerSetID}, function(data) {
          $scope.answerSet = data.items;
          $scope.answers = $scope.answerSet.answers;
          $scope.$broadcast("AnswerSetLoaded");
        });
      }
    });
    
    $scope.$on('AnswerSetLoaded', function (e) {
      _.each($scope.answers, function(answer, name) {
      
        var question = _.find($scope.questions, function (q) {
          return q.name == name;
        });
        if (question !== undefined) {
          question.value = answer;
        }
      });
    });
    
  }
})();