(function() {
  'use strict';

  angular
    .module('dados.study.survey.editSurvey.controller', [])
    .controller('EditSurveyController', EditSurveyController);

  EditSurveyController.$inject = [
    '$modalInstance', 'toastr', 'study', 'forms', 'survey', 'SurveyService', 'SurveySessionService'
  ];

  function EditSurveyController($modalInstance, toastr, study, forms, survey, Survey, SurveySessions) {
    var vm = this;

    // bindable variables
    vm.study = study || {};
    vm.forms = forms || [];
    vm.editSurvey = survey || {};
    vm.savedSessions = angular.copy(survey.sessions);
    vm.isValid = false;
    vm.saving = false;

    // bindable methods
    vm.save = save;
    vm.cancel = cancel;

    ///////////////////////////////////////////////////////////////////////////

    function save() {
      vm.saving = true;
      var sessionsToAdd = [];
      var sessionsToUpdate = [];
      var sessionsToRemove = _.findArrayDiff(
        _.pluck(vm.editSurvey.sessions, 'id'),
        _.pluck(vm.savedSessions, 'id')
      ).toRemove;

      // if we've added sessions, separate calls and partition sessions to be added/updated
      _.each(vm.editSurvey.sessions, function (session) {
        if (_.has(session, 'id')) {
          if (!angular.equals(angular.copy(session), _.find(vm.savedSessions, { id: session.id }))) {
            sessionsToUpdate.push(session);
          }
        } else {
          sessionsToAdd.push(session);
        }
      });

      // update only survey related fields as normal
      var enrollment = new Survey(_.pick(vm.editSurvey, 'name', 'completedBy', 'defaultFormVersions'));
      enrollment
        .$update({ id: survey.id })
        .then(function() { // if sessions were updated
          if (sessionsToUpdate.length > 0) {
            var sessionPromise = new SurveySessions['updateMultiple']({
              sessions: sessionsToUpdate
            });
            return sessionPromise.$update({ surveyID: survey.id });
          }
          return null;
        })
        .then(function() { // if sessions were added
          if (sessionsToAdd.length > 0) {
            var sessionPromise = new SurveySessions['addMultiple']({
              sessions: sessionsToAdd
            });
            return sessionPromise.$update({ surveyID: survey.id });
          }
          return null;
        })
        .then(function () { // if sessions were removed
          if (sessionsToRemove.length > 0) {
            var sessionPromise = new SurveySessions['removeMultiple']({
              sessions: _.map(sessionsToRemove, function (sessionId) {
                return _.find(vm.savedSessions, { id: sessionId });
              })
            });
            return sessionPromise.$update({ surveyID: survey.id });
          }
          return null;
        })
        .then(function () {
          var message = 'Updated survey ' + vm.editSurvey.name;
          message += (sessionsToAdd.length > 0) ? ', added ' + sessionsToAdd.length + ' session(s) to survey' : '';
          message += (sessionsToUpdate.length > 0) ? ', updated ' + sessionsToAdd.length + ' session(s) from survey' : '';
          message += (sessionsToRemove.length > 0) ? ', removed ' + sessionsToAdd.length + ' session(s) from survey' : '';
          toastr.success(message, 'Survey');
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
