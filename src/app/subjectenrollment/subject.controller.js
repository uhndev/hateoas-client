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
    '$scope', '$resource', '$location', '$modal', 'ngTableParams', 'API', 'AuthService'
  ];

  function SubjectOverviewController($scope, $resource, $location, $modal, TableParams, API, AuthService) {
    var vm = this;

    // bindable variables
    vm.subjectInfo = {};
    vm.allow = {};
    vm.template = {};
    vm.resource = {};
    vm.url = API.url() + $location.path();

    // bindable methods
    vm.openEditSubject = openEditSubject;

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

        vm.tableParams = new TableParams({
          page: 1,            // show first page
          count: 10           // count per page
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
  }
})();
