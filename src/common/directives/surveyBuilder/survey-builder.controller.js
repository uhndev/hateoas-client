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
   * @param $scope
   * @param STAGES
   * @param TableParams
   * @constructor
   */
  function SurveyBuilderController($scope, STAGES, TableParams) {
    var vm = this;

    // private variables
    var stepSize = 2;                          // amount of sessions to add when scrolling down
    var defaultLoad = 10;                      // default number of sessions to limit to
    var infiniteThreshold = 20;                // minimum number of sessions required for infinite-scrolling

    // bindable variables
    vm.hideInactiveForms = false;              // boolean denoting whether all inactive forms should be hidden
    vm.isFormsToggled = false;                 // boolean denoting whether all forms per session are visible
    vm.isSessionsToggled = false;              // boolean denoting whether all session can be affected by applying all
    vm.isDefaultsCollapsed = false;            // boolean denoting whether side panel of default forms is visible
    vm.cascadeDefaults = true;                 // denotes whether or not to cascade changes in form order to each session
    vm.newSession = {};                        // palette for generating/adding sessions to vm.survey.sessions
    vm.survey = vm.survey || {sessions: []}; // object storing full survey definition to be loaded or built
    vm.study = vm.study || {};                 // object storing study definition
    vm.forms = vm.forms || [];                 // array storing form definitions
    vm.formVersions = {};                      // dictionary storing latest form versions by id
    vm.latestSurveyVersion = 1;                // id of latest survey version
    vm.STAGES = angular.copy(STAGES);          // constants defining states/stages of survey creation
    vm.loadLimit = 10;                         // max number of sessions to show in window
    vm.beginLimit = 0;                         // number of sessions in timeline to limit from the beginning

    vm.sessionColumns = [
      {title: 'Name', field: 'name', type: 'text'},
      {title: 'Type', field: 'type', type: 'dropdown', options: [
        {prompt: 'Scheduled', value: 'scheduled'},
        {prompt: 'Recurring', value: 'recurring'},
        {prompt: 'Non-scheduled', value: 'non-scheduled'}
      ]},
      {title: 'Timepoint', field: 'timepoint', type: 'number'},
      {title: 'Available From', field: 'availableFrom', type: 'number'},
      {title: 'Available To', field: 'availableTo', type: 'number'}
    ];
    vm.toggleReload = false;

    // bindable methods
    vm.addRemoveForm = addRemoveForm;
    vm.isFormActive = isFormActive;
    vm.onToggleCascadeDefaults = onToggleCascadeDefaults;
    vm.generateSessions = generateSessions;
    vm.loadMore = loadMore;
    vm.toggleForms = toggleForms;
    vm.toggleSessions = toggleSessions;

    init();

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Private Methods
     */
    function init() {
      angular.copy(_.sortBy(vm.survey.sessions, 'timepoint'), vm.survey.sessions);

      // sort and retrieve latest revisions of forms
      if (!_.has(vm.forms, 'versions')) {
        // master list of all form versions
        vm.allFormVersions = _.flatten(_.map(vm.forms, function (form) {
          return form.versions;
        }));

        // stored list of latest form versions
        vm.forms = _.map(vm.forms, function (form) {
          var latestForm = _.last(_.sortBy(form.versions, 'revision'));
          latestForm = _.pick(latestForm, 'id', 'name', 'description', 'revision', 'form');
          latestForm.active = true;
          return latestForm;
        });

        // store dictionary of all forms
        vm.formVersions = _.indexBy(angular.copy(vm.allFormVersions), 'id');
      }

      // sort and retrieve latest revisions of surveys
      if (_.has(vm.survey, 'versions') && vm.survey.versions.length > 1) {
        // store latest survey version
        vm.latestSurveyVersion = _.last(_.sortBy(vm.survey.versions, 'revision'));
      }

      // check if editing existing survey, if so, disable auto-cascade
      if (_.has(vm.survey, 'id')) {
        vm.cascadeDefaults = false;
        vm.isDefaultsCollapsed = true;

        // update any out of date info in survey.defaultFormVersions (if name/revision changed)
        _.map(vm.survey.defaultFormVersions, function (formVersion) {
          var updatedForm = _.find(vm.forms, {id: formVersion.id});
          if (updatedForm) {
            formVersion.name = updatedForm.name;
            formVersion.revision = updatedForm.revision;
          }
          return formVersion;
        });

        var formDiffs = _.findArrayDiff(_.pluck(vm.forms, 'id'), _.pluck(vm.survey.defaultFormVersions, 'id'));

        // check if any new forms have been added and add them if so
        if (!_.isEmpty(formDiffs.toAdd)) {
          _.each(formDiffs.toAdd, function (formToAdd) {
            var newForm = _.find(vm.forms, {id: formToAdd});
            newForm.active = false;
            vm.survey.defaultFormVersions.push(newForm);
          });
        }
        // check if any new forms have been removed and remove them if so
        if (!_.isEmpty(formDiffs.toRemove)) {
          vm.survey.defaultFormVersions = _.reject(vm.survey.defaultFormVersions, function (formVersion) {
            return _.contains(formDiffs.toRemove, formVersion.id);
          });
        }
      } else {
        // if creating new survey, set defaultFormVersions from vm.forms
        vm.survey.defaultFormVersions = [];
        _.each(vm.forms, function (form) {
          vm.survey.defaultFormVersions.push(form);
        });
      }

      // depending on length of survey, disable/enable infinite-scroll
      if (!_.has(vm.survey, 'sessions')) {
        vm.survey.sessions = [];
        vm.loadLimit = 0;
      } else {
        vm.loadLimit = (vm.survey.sessions.length > infiniteThreshold) ? defaultLoad : vm.survey.sessions.length;
      }

      vm.tableParams = new TableParams({
        page: 1,
        count: 10
      }, {
        groupBy: 'type',
        data: vm.survey.sessions
      });
    }

    /**
     * Public Methods
     */

    /**
     * addRemoveForm
     * @description Adds or removes formVersion from session on the 'Select Forms' interface
     * @param formVersion formVersion object
     * @param session session object with list of formVersions
     */
    function addRemoveForm(formVersion, session) {
      var formId = parseInt((_.has(formVersion, 'id') ? formVersion.id : formVersion));
      if (_.inArray(session.formVersions, formId)) {
        session.formVersions = _.without(session.formVersions, formId);
      } else {
        session.formVersions.push(formId);
      }
    }

    /**
     * isFormActive
     * @param form
     * @param session
     * @returns {Boolean} true if formVersion is in session, false otherwise
     */
    function isFormActive(form, session) {
      var formId = parseInt((_.has(form, 'id') ? form.id : form));
      return _.inArray(session.formVersions, formId);
    }

    /**
     * onToggleCascadeDefaults
     * @description Click handler for the toggle checkbox; if checkbox was true, changes in left panel will propogate
     *              to all sessions in the Survey Builder interface.
     */
    function onToggleCascadeDefaults() {
      if (vm.cascadeDefaults) {
        var formOrder = _.map(_.pluck(vm.survey.defaultFormVersions, 'id'), function (formId) { return parseInt(formId); });
        var formIds = _.map(_.pluck(_.filter(vm.survey.defaultFormVersions, {active: true}), 'id'), function (formId) { return parseInt(formId); });

        _.map(vm.survey.sessions, function (session) {
          if (!session.$noCascade) {
            session.formOrder = angular.copy(formOrder);
            session.formVersions = angular.copy(formIds);
          }
        });
      }
    }

    /**
     * generateSessions
     * @description Depending on session type, generate n sessions if type was
     *              scheduled, or 1 session if type was non-scheduled.  Sessions
     *              will be generated with the latest SurveyVersion.
     */
    function generateSessions() {
      if (!_.isEmpty(vm.newSession)) {
        var formIds = _.map(_.pluck(vm.forms, 'id'), function (formId) { return parseInt(formId); });
        vm.newSession.formOrder = angular.copy(formIds);
        vm.newSession.formVersions = angular.copy(_.filter(formIds, {active: false}));

        switch (vm.newSession.type) {
          case 'scheduled': // if scheduled, session will have name, but repeat will be set to 1
            vm.survey.sessions.push({
              surveyVersion: vm.latestSurveyVersion,
              type: vm.newSession.type,
              name: vm.newSession.name,
              timepoint: vm.newSession.timepoint,
              availableFrom: vm.newSession.availableFrom,
              availableTo: vm.newSession.availableTo,
              formOrder: angular.copy(formIds),
              formVersions: angular.copy(formIds)
            });
            break;
          case 'recurring': // if recurring, session won't have name but will have repeat attributes
            // repeat as many times as needed to generate timepoints
            for (var i = 1; i <= vm.newSession.repeat; i++) {
              var future = vm.newSession.timepoint * i;
              vm.survey.sessions.push({
                surveyVersion: vm.latestSurveyVersion,
                type: vm.newSession.type,
                name: future.toString() + ' Day',
                timepoint: future,
                availableFrom: vm.newSession.availableFrom,
                availableTo: vm.newSession.availableTo,
                formOrder: angular.copy(formIds),
                formVersions: angular.copy(formIds)
              });
            }
            break;
          case 'non-scheduled': // otherwise, its non-scheduled won't have repeat but will have name attribute
            vm.newSession.surveyVersion = vm.latestSurveyVersion;
            vm.newSession.timepoint = 0;
            vm.newSession.availableFrom = 0;
            vm.newSession.availableTo = 0;
            vm.survey.sessions.push(vm.newSession);
            break;
          default: break;
        }

        vm.newSession = {};
        angular.copy(_.sortBy(vm.survey.sessions, 'timepoint'), vm.survey.sessions);
        vm.loadLimit = (vm.survey.sessions.length > infiniteThreshold) ? defaultLoad : vm.survey.sessions.length;
        vm.tableParams.reload();
        vm.toggleReload = !vm.toggleReload;
      }
    }

    /**
     * loadMore
     * @description Callback for when scrollbar reaches bottom of window; will load more elements
     *              depending on total number of available sessions.
     */
    function loadMore() {
      if (vm.survey.sessions.length > infiniteThreshold) {
        if ((vm.loadLimit + stepSize) > vm.survey.sessions.length) {
          vm.loadLimit = vm.survey.sessions.length;
        } else {
          vm.loadLimit += stepSize;
        }
      }
    }

    /**
     * toggleForms
     * @description Click handler for toggling form visibility
     */
    function toggleForms(isFormsToggled) {
      //vm.isFormsToggled = !vm.isFormsToggled;
      _.map(vm.survey.sessions, function (session) {
        session.$isCollapsed = isFormsToggled;
      });
    }

    /**
     * toggleSessions
     * @description Click handler for toggling whether sessions can be affected by cascading changes
     */
    function toggleSessions(isSessionsToggled) {
      //vm.isSessionsToggled = !vm.isSessionsToggled;
      _.map(vm.survey.sessions, function (session) {
        session.$noCascade = isSessionsToggled;
      });
    }

    $scope.$watch('sb.survey', function(newVal, oldVal) {
      vm.isValid = (_.has(vm.surveyForm, '$valid') && _.has(vm.survey, 'sessions')) ?
                   (vm.surveyForm.$valid && vm.survey.sessions.length > 0) : false;
    }, true);

    $scope.$watch('sb.survey.defaultFormVersions', function(newVal, oldVal) {
      onToggleCascadeDefaults();
    }, true);
  }
})();
