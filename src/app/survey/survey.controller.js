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

        vm.tableParams = new TableParams({
          page: 1,
          count: 10
        }, {
          groupBy: "type",
          data: _.sortBy(vm.resource.sessionForms, 'timepoint')
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
            return angular.copy(vm.resource.sessionStudy.forms);
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
