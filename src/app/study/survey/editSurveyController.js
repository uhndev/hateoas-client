(function() {
  'use strict';

  angular
    .module('dados.study.survey.editSurvey.controller', [])
    .controller('EditSurveyController', EditSurveyController);

  EditSurveyController.$inject = [
    '$modalInstance', '$q', 'toastr', 'study', 'forms', 'survey', 'SurveyService', 'SessionService'
  ];

  function EditSurveyController($modalInstance, $q, toastr, study, forms, survey, Survey, Session) {
    var vm = this;

    // bindable variables
    vm.study = study || {};
    vm.forms = forms || [];
    vm.editSurvey = survey || {};
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

      // if we've added sessions, separate calls and partition sessions to be added/updated
      _.each(vm.editSurvey.sessions, function (session) {
        if (_.has(session, 'id')) {
          sessionsToUpdate.push(session);
        } else {
          sessionsToAdd.push(session);
        }
      });

      // update existing sessions in survey for update
      if (sessionsToAdd.length > 0) {
        angular.copy(sessionsToUpdate, vm.editSurvey.sessions);
      }

      // update survey as normal
      var enrollment = new Survey(vm.editSurvey);
      enrollment
        .$update({ id: survey.id })
        .then(function() {
          // if sessions were added, add to promise chain and create sessions in study
          if (sessionsToAdd.length > 0) {
            return $q.all(_.map(sessionsToAdd, function (session) {
              session.survey = survey.id;
              var sessionPromise = new Session(session);
              sessionPromise.surveyID = survey.id;
              return sessionPromise.$save();
            }));
          }
          return null;
        })
        .then(function () {
          var message = 'Updated survey ' + vm.editSurvey.name;
          message += (sessionsToAdd.length > 0) ? ' and added ' + sessionsToAdd.length + ' sessions to survey' : '';
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
