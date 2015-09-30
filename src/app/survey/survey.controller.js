(function() {
  'use strict';
  angular
    .module('dados.survey.controller', [
      'dados.survey.service',
      'dados.common.services.resource'
    ])
    .controller('SurveyOverviewController', SurveyOverviewController);

  SurveyOverviewController.$inject = [
    '$scope', '$resource', '$location', '$modal', 'API', 'NgTableParams', 'AuthService'
  ];

  function SurveyOverviewController($scope, $resource, $location, $modal, API, TableParams, AuthService) {
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
        AuthService.setSubmenu(vm.resource.sessionStudy.name, data, $scope.dados.submenu);

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
        console.log(scheduledForms);

        vm.tableParams = new TableParams({
          page: 1,
          count: 10
        }, {
          groupBy: "name",
          data: scheduledForms
        });
      });
    }

    function openEditSurvey() {
      var modalInstance = $modal.open({
        animation: true,
        size: 'lg',
        templateUrl: 'study/survey/editSurveyModal.tpl.html',
        controller: 'EditSurveyController',
        controllerAs: 'editSurvey',
        bindToController: true,
        resolve: {
          study: function() {
            return angular.copy(vm.resource.sessionStudy);
          },
          forms: function() {
            // resolve study forms
            var StudyForms = $resource(API.url() + '/study/' + vm.resource.sessionStudy.name + '/form');
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
