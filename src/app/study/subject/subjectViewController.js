(function() {
  'use strict';
  angular
    .module('dados.study.subject', [
      'dados.common.directives.hateoas.controls',
      'dados.subject.service'
    ])
    .controller('StudySubjectController', StudySubjectController);

  StudySubjectController.$inject = [
    '$scope', '$resource', '$location', 'AuthService', 'ngTableParams', 'sailsNgTable',
    'toastr', 'API', 'SubjectEnrollmentService', 'SubjectService'
  ];

  function StudySubjectController($scope, $resource, $location, AuthService, TableParams, SailsNgTable,
                                  toastr, API, SubjectEnrollment, Subject) {

    var vm = this;

    // bindable variables
    vm.allows = 'create';
    vm.allow = {};
    vm.query = { 'where' : {} };
    vm.selected = null;
    vm.template = {};
    vm.resource = {};
    vm.url = API.url() + $location.path();

    // bindable methods;
    vm.select = select;
    vm.openSubject = openSubject;
    vm.newSubject = newSubject;
    vm.editSubject = editSubject;
    vm.archiveSubject = archiveSubject;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var currStudy = _.getStudyFromUrl($location.path());
      var Resource = $resource(vm.url);
      var TABLE_SETTINGS = {
        page: 1,
        count: 10,
        filter: vm.filters
      };

      $scope.tableParams = new TableParams(TABLE_SETTINGS, {
        counts: [],
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
            if (currStudy && _.has(data, 'links') && data.links.length > 0) {
              // from workflowstate and current url study
              // replace wildcards in href with study name
              _.map(data.links, function(link) {
                if (link.rel === 'overview' && link.prompt === '*') {
                  link.prompt = currStudy;
                }
                if (_.contains(link.href, '*')) {
                  link.href = link.href.replace(/\*/g, currStudy);
                }
                return link;
              });
              var submenu = {
                links: AuthService.getRoleLinks(data.links)
              };
              angular.copy(submenu, $scope.dados.submenu);
            }
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

    function newSubject() {
    }

    function editSubject() {
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
