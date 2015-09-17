(function() {
  'use strict';

  angular
    .module('dados.common.directives.surveyBuilder.controller', [
      'dados.common.directives.listEditor',
      'angular-timeline'
    ])
    .constant('STAGES', { // stages of survey creation
      'DEFINE_SURVEY': true,
      'SELECT_FORMS': false
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
    vm.forms = vm.forms || [];                 // array storing form definitions
    vm.formVersions = [];                      // array storing latest form versions
    vm.STAGES = angular.copy(STAGES);          // constants defining states/stages of survey creation
    vm.selectedAllSessions = false;            // boolean storing whether or not user clicked select all sessions
    vm.selectedAllForms = false;               // boolean storing whether or not user clicked select all forms
    vm.sessionColumns = [
      { title: 'Type', field: 'type', type: 'dropdown', options: [
        { prompt: 'Scheduled', value: 'scheduled' },
        { prompt: 'Non-scheduled', value: 'non-scheduled' }
      ]},
      { title: 'Name', field: 'name', type: 'text'},
      { title: 'Timepoint', field: 'timepoint', type: 'number'},
      { title: 'Available From', field: 'availableFrom', type: 'number'},
      { title: 'Available To', field: 'availableTo', type: 'number'}
    ];
    vm.toggleReload = false;

    // bindable methods
    vm.addRemoveForm = addRemoveForm;
    vm.isFormActive = isFormActive;
    vm.generateSessions = generateSessions;

    init();

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Private Methods
     */
    function init() {
      // sort and retrieve latest revisions of forms
      if (!_.has(vm.forms, 'versions')) {
        // store array of latest forms
        vm.formVersions = _.map(vm.forms, function (form) {
          return _.last(_.sortBy(form.versions, 'revision'));
        });
      }
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

    /**
     * Public Methods
     */
    function addRemoveForm(formVersion, session) {
      console.log(session);
      console.log(formVersion);
      if (_.inArray(session.formVersions, formVersion.id)) {
        session.formVersions = _.without(session.formVersions, formVersion.id);
      } else {
        session.formVersions.push(formVersion.id);
      }
    }

    function isFormActive(form, session) {
      return _.inArray(session.formVersions, form.id);
    }

    function generateSessions() {
      if (!_.isEmpty(vm.newSession)) {
        vm.newSession.formVersions = _.pluck(vm.formVersions, 'id');
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
              availableTo: vm.newSession.availableTo,
              formVersions: _.pluck(vm.formVersions, 'id')
            });
          }
        }
        // otherwise, its non-scheduled won't have repeat but will have name attribute
        else {
          vm.survey.sessions.push(vm.newSession);
        }
        vm.newSession = {};
        angular.copy(_.sortBy(vm.survey.sessions, 'timepoint'), vm.survey.sessions);
        vm.tableParams.reload();
        vm.toggleReload = !vm.toggleReload;
      }
    }

    $scope.$watch('surveyBuilder.survey', function(newVal, oldVal) {
      vm.isValid = (_.has(vm.surveyForm, '$valid') && _.has(vm.survey, 'sessions')) ?
                   (vm.surveyForm.$valid && vm.survey.sessions.length > 0) : false;
    }, true);
  }
})();
