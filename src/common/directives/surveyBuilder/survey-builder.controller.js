(function() {
  'use strict';

  angular
    .module('dados.common.directives.surveyBuilder.controller', [])
    .constant('STAGES', { // stages of survey creation
      'DEFINE_SURVEY': 0,
      'SELECT_FORMS': 1,
      'REVIEW_SURVEY': 2
    })
    .controller('SurveyBuilderController', SurveyBuilderController);

  SurveyBuilderController.$inject = ['$scope', 'STAGES', 'ngTableParams'];

  /**
   * @name SurveyBuilderController
   * @param STAGES
   * @constructor
   */
  function SurveyBuilderController($scope, STAGES, TableParams) {
    var vm = this;

    // bindable variables
    vm.newSession = {};                        // palette for generating/adding sessions to vm.survey.sessions
    vm.survey = vm.survey || { sessions: [] }; // object storing full survey definition to be loaded or built
    vm.study = vm.study || {};                 // object storing study definition
    vm.STAGES = STAGES;                        // constants defining states/stages of survey creation

    // bindable methods
    vm.generateSessions = generateSessions;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      if (!_.has(vm.survey, 'sessions')) {
        vm.survey.sessions = [];
      }
      vm.tableParams = new TableParams({
        page: 1,
        count: 10
      }, {
        groupBy: "type",
        data: vm.survey.sessions
      });
    }

    function generateSessions() {
      if (!_.isEmpty(vm.newSession)) {
        // if scheduled, session won't have name but will have repeat attributes
        if (vm.newSession.type === 'scheduled') {
          // repeat as many times as needed to generate timepoints
          for (var i=1; i <= vm.newSession.repeat; i++) {
            var future = vm.newSession.timepoint * i;
            vm.survey.sessions.push({
              surveyVersion: 1,
              type: vm.newSession.type,
              name: future.toString() + ' Day',
              timepoint: future,
              availableFrom: vm.newSession.availableFrom,
              availableTo: vm.newSession.availableTo
            });
          }
        }
        // otherwise, its non-scheduled won't have repeat but will have name attribute
        else {
          vm.survey.sessions.push(vm.newSession);
        }
        vm.newSession = {};
        vm.tableParams.reload();
      }
    }

    $scope.$watch('surveyBuilder.survey', function(newVal, oldVal) {
      vm.isValid = (_.has(vm.surveyForm, '$valid') && _.has(vm.survey, 'sessions')) ?
                   (vm.surveyForm.$valid && vm.survey.sessions.length > 0) : false;
    }, true);
  }
})();
