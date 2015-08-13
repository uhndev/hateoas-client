(function() {
  'use strict';
  angular
    .module('dados.study.subject', [
      'dados.subject.constants',
      'dados.study.subject.addSubject.controller',
      'dados.study.subject.editSubject.controller',
      'dados.common.directives.hateoas.controls',
      'dados.subject.service'
    ])
    .controller('StudySubjectController', StudySubjectController);

  StudySubjectController.$inject = [
    '$scope', '$resource', '$location', '$modal', 'AuthService', 'ngTableParams', 'sailsNgTable',
    'toastr', 'API', 'SubjectEnrollmentService', 'SubjectService'
  ];

  function StudySubjectController($scope, $resource, $location, $modal, AuthService, TableParams,
                                  SailsNgTable, toastr, API, SubjectEnrollment, Subject) {

    var vm = this;

    // bindable variables
    vm.centreHref = '';
    vm.allow = {};
    vm.query = { 'where' : {} };
    vm.selected = null;
    vm.template = {};
    vm.resource = {};
    vm.subjectForm = {};
    vm.url = API.url() + $location.path();

    // bindable methods;
    vm.select = select;
    vm.openSubject = openSubject;
    vm.openAddSubject = openAddSubject;
    vm.openEditSubject = openEditSubject;
    vm.archiveSubject = archiveSubject;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var currStudy = _.getStudyFromUrl($location.path());
      vm.centreHref = "study/" + currStudy + "/collectioncentre";
      var Study = $resource(API.url() + '/study/' + currStudy);
      Study.get(function (data, headers) {
        vm.study = data.items;
      });

      var Resource = $resource(vm.url);
      var TABLE_SETTINGS = {
        page: 1,
        count: 10,
        filter: vm.filters
      };

      $scope.tableParams = new TableParams(TABLE_SETTINGS, {
        getData: function($defer, params) {
          var api = SailsNgTable.parse(params, vm.query);

          Resource.get(api, function(data, headers) {
            vm.selected = null;
            var permissions = headers('allow').split(',');
            _.each(permissions, function (permission) {
              vm.allow[permission] = true;
            });

            vm.template = data.template;
            vm.resource = angular.copy(data);

            params.total(data.total);
            $defer.resolve(data.items);

            // initialize submenu
            AuthService.setSubmenu(currStudy, data, $scope.dados.submenu);
          });
        }
      });
    }

    function select(item) {
      vm.selected = (vm.selected === item ? null : item);
    }

    function openSubject() {
      if (vm.selected.rel) {
        $location.path(_.convertRestUrl(vm.selected.href, API.prefix));
      }
    }

    function openAddSubject() {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'study/subject/addSubjectModal.tpl.html',
        controller: 'AddSubjectController',
        controllerAs: 'addSubject',
        bindToController: true,
        resolve: {
          study: function() {
            return angular.copy(vm.study);
          },
          centreHref: function () {
            return vm.centreHref;
          }
        }
      });

      modalInstance.result.then(function () {
        $scope.tableParams.reload();
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
            return angular.copy(vm.selected);
          },
          study: function() {
            return angular.copy(vm.study);
          },
          centreHref: function () {
            return vm.centreHref;
          }
        }
      });

      modalInstance.result.then(function () {
        $scope.tableParams.reload();
      });
    }

    function archiveSubject() {
      var conf = confirm("Are you sure you want to archive this enrollment?");
      if (conf) {
        var enrollment = new SubjectEnrollment({ id: vm.selected.id });
        return enrollment.$delete({ id: vm.selected.id }).then(function () {
          toastr.success('Archived subject enrollment!', 'Enrollment');
          $scope.tableParams.reload();
        });
      }
    }

    // watchers
    $scope.$watchCollection('studySubject.query.where', function(newQuery, oldQuery) {
      if (newQuery && !_.isEqual(newQuery, oldQuery)) {
        // Page changes will trigger a reload. To reduce the calls to
        // the server, force a reload only when the user is already on
        // page 1.
        if ($scope.tableParams.page() !== 1) {
          $scope.tableParams.page(1);
        } else {
          $scope.tableParams.reload();
        }
      }
    });

    $scope.$on('hateoas.client.refresh', function() {
      init();
    });
  }
})();
