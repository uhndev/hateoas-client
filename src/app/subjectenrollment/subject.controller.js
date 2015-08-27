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

    var sampleData = [
      {
        "name": "Form 10",
        "date": new Date(),
        "status": "Completed",
        "encounter": "Consent"
      },
      {
        "name": "Form 9",
        "date": new Date(),
        "status": "Late",
        "encounter": "Visit 1"
      },
      {
        "name": "Form 6",
        "date": new Date(),
        "status": "Completed",
        "encounter": "Visit 1"
      },
      {
        "name": "Form 6",
        "date": new Date(),
        "status": "Incomplete",
        "encounter": "Visit 1"
      },
      {
        "name": "Form 4",
        "date": new Date(),
        "status": "Late",
        "encounter": "Visit 2"
      },
      {
        "name": "Form 5",
        "date": new Date(),
        "status": "Incomplete",
        "encounter": "Visit 2"
      },
      {
        "name": "Form 0",
        "date": new Date(),
        "status": "Late",
        "encounter": "Visit 3"
      },
      {
        "name": "Form 5",
        "date": new Date(),
        "status": "Late",
        "encounter": "Visit 3"
      },
      {
        "name": "Form 9",
        "date": new Date(),
        "status": "Late",
        "encounter": "Visit 3"
      },
      {
        "name": "Form 5",
        "date": new Date(),
        "status": "Incomplete",
        "encounter": "Visit 3"
      },
      {
        "name": "Form 10",
        "date": new Date(),
        "status": "Completed",
        "encounter": "Visit 3"
      },
      {
        "name": "Form 8",
        "date": new Date(),
        "status": "Completed",
        "encounter": "Visit 4"
      },
      {
        "name": "Form 8",
        "date": new Date(),
        "status": "Late",
        "encounter": "Visit 4"
      },
      {
        "name": "Form 2",
        "date": new Date(),
        "status": "Incomplete",
        "encounter": "Visit 4"
      },
      {
        "name": "Form 8",
        "date": new Date(),
        "status": "Late",
        "encounter": "Visit 5"
      },
      {
        "name": "Form 8",
        "date": new Date(),
        "status": "Late",
        "encounter": "Visit 6"
      },
      {
        "name": "Form 9",
        "date": new Date(),
        "status": "Incomplete",
        "encounter": "Visit 7"
      },
      {
        "name": "Form 7",
        "date": new Date(),
        "status": "Late",
        "encounter": "Visit 7"
      }
    ];

    $scope.tableParams = new TableParams({
      page: 1,            // show first page
      count: 10           // count per page
    }, {
      groupBy: 'encounter',
      total: sampleData.length,
      getData: function($defer, params) {
        $defer.resolve(sampleData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
      }
    });

    function init() {
      var SubjectEnrollment = $resource(vm.url);
      SubjectEnrollment.get(function(data, headers) {
        vm.template = data.template;
        vm.resource = angular.copy(data.items);
        var permissions = headers('allow').split(',');
        _.each(permissions, function (permission) {
          vm.allow[permission] = true;
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
