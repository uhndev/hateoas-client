(function() {
  'use strict';
  angular
    .module('dados.study.survey', [
      'dados.common.directives.hateoas.controls',
      'dados.common.directives.surveyBuilder',
      'dados.study.survey.addSurvey.controller',
      'dados.study.survey.editSurvey.controller'
    ])
    .controller('StudySurveyController', StudySurveyController);

  StudySurveyController.$inject = [
    '$scope', '$location', '$modal', 'AuthService', 'toastr', 'StudyService', 'API'
  ];

  function StudySurveyController($scope, $location, $modal, AuthService, toastr, Study, API) {

    var vm = this;

    // private variables
    var currStudy = _.getStudyFromUrl($location.path());

    // bindable variables
    vm.study = {};
    vm.allow = {};
    vm.query = { 'where' : {} };
    vm.selected = null;
    vm.template = {};
    vm.resource = {};
    vm.url = API.url() + $location.path();

    // bindable methods;
    vm.onResourceLoaded = onResourceLoaded;
    vm.openSurvey = openSurvey;
    vm.openAddSurvey = openAddSurvey;
    vm.openEditSurvey = openEditSurvey;
    vm.archiveSurvey = archiveSurvey;

    init();

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Private Methods
     */
    function init() {
      Study.query({ name: currStudy }).$promise.then(function (data) {
        vm.study = _.first(data);
      });
    }

    function loadModal(type) {
      var modalSettings = {
        animation: true,
        templateUrl: 'study/survey/' + type + 'SurveyModal.tpl.html',
        controller: _.capitalize(type) + 'SurveyController',
        controllerAs: type + 'Survey',
        size: 'lg',
        bindToController: true,
        backdrop: 'static',
        resolve: {
          study: function () {
            return angular.copy(vm.study);
          }
        }
      };

      if (type === 'edit') {
        modalSettings.resolve.survey = function() {
          return angular.copy(vm.selected);
        };
      }

      return modalSettings;
    }

    /**
     * Public Methods
     */
    function onResourceLoaded(data) {
      if (data) {
        // initialize submenu
        AuthService.setSubmenu(currStudy, data, $scope.dados.submenu);
      }
      return data;
    }

    function openSurvey() {
      if (vm.selected.rel) {
        $location.path(_.convertRestUrl(vm.selected.href, API.prefix));
      }
    }

    function openAddSurvey() {
      $modal.open(loadModal('add')).result.then(function () {
        $scope.$broadcast('hateoas.client.refresh');
      });
    }

    function openEditSurvey() {
      $modal.open(loadModal('edit')).result.then(function () {
        $scope.$broadcast('hateoas.client.refresh');
      });
    }

    function archiveSurvey() {
      var conf = confirm("Are you sure you want to archive this survey?");
      if (conf) {
        var survey = new Survey({ id: vm.selected.id });
        return survey.$delete({ id: vm.selected.id }).then(function () {
          toastr.success('Archived survey!', 'Survey');
          $scope.$broadcast('hateoas.client.refresh');
        });
      }
    }
  }
})();
