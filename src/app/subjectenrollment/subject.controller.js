(function() {
  'use strict';
  angular
    .module('dados.subject.controller', [
      'dados.subject.service',
      'dados.common.services.resource',
      'dados.common.directives.selectLoader',
      'dados.common.directives.simpleTable'
    ])
    .controller('SubjectOverviewController', SubjectOverviewController);

  SubjectOverviewController.$inject = [
    '$scope', '$resource', '$location', '$modal', 'toastr', 'ngTableParams', 'API', 'AuthService', 'SubjectScheduleService'
  ];

  function SubjectOverviewController($scope, $resource, $location, $modal, toastr, TableParams, API, AuthService, SubjectSchedule) {
    var vm = this;

    // bindable variables
    vm.subjectInfo = {};
    vm.allow = {};
    vm.template = {};
    vm.resource = {};
    vm.surveyFilter = {};
    vm.surveys = [];
    vm.url = API.url() + $location.path();

    // bindable methods
    vm.openEditSubject = openEditSubject;
    vm.openDate = openDate;
    vm.saveSchedule = saveSchedule;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var SubjectEnrollment = $resource(vm.url);
      SubjectEnrollment.get(function(data, headers) {
        vm.template = data.template;
        vm.resource = angular.copy(data.items);
        var permissions = headers('allow').split(',');
        _.each(permissions, function (permission) {
          vm.allow[permission] = true;
        });
        vm.surveys = _.union(_.pluck(data.items.formSchedules, 'surveyName'));

        vm.tableParams = new TableParams({
          page: 1,            // show first page
          count: 10,          // count per page
          filter: vm.surveyFilter
        }, {
          groupBy: 'name',
          total: data.items.formSchedules.length,
          data: data.items.formSchedules
        });

        // initialize submenu
        AuthService.setSubmenu(vm.resource.studyName, data, $scope.dados.submenu);
      });
    }

    function openEditSubject() {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'study/subject/editSubjectModal.tpl.html',
        controller: 'EditSubjectController',
        controllerAs: 'editSubject',
        bindToController: true,
        resolve: {
          subject: function() {
            return vm.resource;
          },
          study: function() {
            return vm.resource.studyAttributes;
          },
          centreHref: function () {
            return "study/" + vm.resource.studyName + "/collectioncentre";
          }
        }
      });
    }

    function openDate($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }

    function saveSchedule(schedule) {
      SubjectSchedule.update(_.pick(schedule, 'id', 'availableFrom', 'availableTo'), function () {
        toastr.success('Updated scheduled session ' + schedule.name + ' for form ' + schedule.scheduledForm.name, 'Form');
        init();
      });
    }
  }
})();
