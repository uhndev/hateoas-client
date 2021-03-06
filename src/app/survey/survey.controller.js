(function() {
  'use strict';
  angular
    .module('dados.survey.controller', [
      'dados.survey.service',
      'dados.common.services.resource'
    ])
    .controller('SurveyOverviewController', SurveyOverviewController);

  SurveyOverviewController.$inject = [
    '$resource', '$location', '$uibModal', 'API', 'NgTableParams', 'HeaderService'
  ];

  function SurveyOverviewController($resource, $location, $uibModal, API, TableParams, HeaderService) {
    var vm = this;

    // bindable variables
    vm.allow = {};
    vm.template = {};
    vm.resource = {};
    vm.url = API.url() + $location.path();

    // bindable methods
    vm.openEditSurvey = openEditSurvey;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Survey = $resource(vm.url);
      Survey.get(function(data, headers) {
        vm.template = data.template;
        vm.resource = angular.copy(data.items);
        var permissions = headers('allow').split(',');
        _.each(permissions, function (permission) {
          vm.allow[permission] = true;
        });
        // initialize submenu
        HeaderService.setSubmenu('study', data.links);

        var scheduledForms = [];
        var sessions = angular.copy(_.sortBy(vm.resource.sessionForms, 'timepoint'));
        // create 1D list of scheduled forms
        _.each(sessions, function (session) {
          _.each(session.formOrder, function (formOrderId) {
            // if ordered form is active for this session
            if (_.contains(_.pluck(session.formVersions, 'id'), formOrderId)) {
              var sessionForm = _.clone(session);
              sessionForm.formItem = vm.resource.sessionStudy.possibleForms[formOrderId];
              scheduledForms.push(sessionForm);
            }
          });
        });

        vm.tableParams = new TableParams({
          page: 1,
          count: 10
        }, {
          groupBy: 'name',
          data: scheduledForms
        });
      });
    }

    function openEditSurvey() {
      var modalInstance = $uibModal.open({
        animation: true,
        size: 'lg',
        templateUrl: 'study/surveys/editSurveyModal.tpl.html',
        controller: 'EditSurveyController',
        controllerAs: 'editSurvey',
        bindToController: true,
        windowClass: 'modal-window',
        resolve: {
          study: function() {
            return angular.copy(vm.resource.sessionStudy);
          },
          forms: function() {
            // resolve study forms
            var StudyForms = $resource(API.url() + '/study/' + vm.resource.sessionStudy.id + '/forms');
            return StudyForms.get().$promise.then(function (data) {
              return data.items;
            });
          },
          survey: function() {
            var survey = angular.copy(vm.resource);
            survey.sessions = [];
            _.each(survey.sessionForms, function(session) {
              if (!_.isArray(session.formVersions) && !_.isNull(session.formVersions)) {
                session.formVersions = [session.formVersions];
              }
              session.formVersions = _.pluck(session.formVersions, 'id');
              survey.sessions.push(session);
            });
            delete survey.sessionForms;
            return survey;
          }
        }
      });
      modalInstance.result.then(function () {
        init();
      });
    }
  }
})();
