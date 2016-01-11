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
    '$resource', '$location', '$uibModal', 'toastr', 'ngTableParams',
    'API', 'moment', 'StudyService', 'HeaderService', 'SubjectScheduleService'
  ];

  function SubjectOverviewController($resource, $location, $uibModal, toastr, TableParams,
                                     API, moment, Study, HeaderService, SubjectSchedule) {
    var vm = this;

    // bindable variables
    vm.subjectInfo = {};
    vm.allow = {};
    vm.template = {};
    vm.resource = {};
    vm.surveyFilter = {};
    vm.surveys = [];
    vm.tempParams = { page: null, count: null };
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

        // populate filter dropdown for survey table
        vm.surveys = _.union(_.pluck(data.items.formSchedules, 'surveyName'));

        vm.tableParams = new TableParams({
          page: vm.tempParams.page   || 1,           // show first page
          count: vm.tempParams.count || 10,          // count per page
          filter: vm.surveyFilter
        }, {
          groupBy: 'name',
          total: data.items.formSchedules.length,
          data: data.items.formSchedules
        });

        // initialize submenu
        HeaderService.setSubmenu('study', data.links);
      });
    }

    /**
     * openEditSubject
     * @description Function for opening the subject edit modal window.
     */
    function openEditSubject() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'study/subjects/editSubjectModal.tpl.html',
        controller: 'EditSubjectController',
        controllerAs: 'editSubject',
        bindToController: true,
        resolve: {
          subject: function() {
            var subject = angular.copy(vm.resource);
            // check for invalid doe dates
            if (_.isUndefined(subject.doe)) {
              delete subject.doe;
            } else {
              if (angular.isString(subject.doe)) {
                subject.doe = new Date(subject.doe);
              }
            }
            return subject;
          },
          study: function() {
            return Study.get({ id: vm.resource.study }).$promise;
          },
          centreHref: function () {
            return "study/" + vm.resource.study + "/collectioncentres";
          }
        }
      });
    }

    /**
     * openDate
     * @description Dummy function to prevent defaults when opening the ui-datepicker
     * @param $event
     */
    function openDate($event) {
      $event.preventDefault();
      $event.stopPropagation();
      // store reference to ng-table count and page variables
      vm.tempParams.count = vm.tableParams.count();
      vm.tempParams.page = vm.tableParams.page();
    }

    /**
     * saveSchedule
     * @description Saves any updates of session availability, triggered with ng-change on any date changes
     * @param schedule
     */
    function saveSchedule(schedule) {
      if (moment(schedule.availableFrom).isBefore(schedule.availableTo) ||
          moment(schedule.availableFrom).isSame(schedule.availableTo)) {
        SubjectSchedule.update(_.pick(schedule, 'id', 'availableFrom', 'availableTo'), function () {
          toastr.success('Updated scheduled session ' + schedule.name + ' for form ' + schedule.scheduledForm.name, 'Form');
          init();
        });
      } else {
        toastr.warning('Available From must be a date before Available To!', 'Schedule');
      }
    }
  }
})();
