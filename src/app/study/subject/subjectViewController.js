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
    '$scope', '$resource', '$location', '$modal', 'AuthService', 'toastr',
    'API', 'SubjectEnrollmentService', 'SubjectService'
  ];

  function StudySubjectController($scope, $resource, $location, $modal, AuthService, toastr,
                                  API, SubjectEnrollment, Subject) {

    var vm = this;

    // private variables
    var currStudy = _.getStudyFromUrl($location.path());
    var centreHref = "study/" + currStudy + "/collectioncentre";

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
    vm.onResourceLoaded = onResourceLoaded;
    vm.openSubject = openSubject;
    vm.openAddSubject = openAddSubject;
    vm.openEditSubject = openEditSubject;
    vm.archiveSubject = archiveSubject;

    init();

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Private Methods
     */
    function init() {
      var Study = $resource(API.url() + '/study/' + currStudy);
      Study.get(function (data, headers) {
        vm.study = data.items;
      });
    }

    function loadModal(type) {
      var modalSettings = {
        animation: true,
        templateUrl: 'study/subject/' + type + 'SubjectModal.tpl.html',
        controller: _.capitalize(type) + 'SubjectController',
        controllerAs: type + 'Subject',
        bindToController: true,
        resolve: {
          study: function () {
            return angular.copy(vm.study);
          },
          centreHref: function () {
            return centreHref;
          }
        }
      };

      if (type === 'edit') {
        modalSettings.resolve.subject = function() {
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

    function openSubject() {
      if (vm.selected.rel) {
        $location.path(_.convertRestUrl(vm.selected.href, API.prefix));
      }
    }

    function openAddSubject() {
      $modal.open(loadModal('add')).result.then(function () {
        $scope.$broadcast('hateoas.client.refresh');
      });
    }

    function openEditSubject() {
      $modal.open(loadModal('edit')).result.then(function () {
        $scope.$broadcast('hateoas.client.refresh');
      });
    }

    function archiveSubject() {
      var conf = confirm("Are you sure you want to archive this enrollment?");
      if (conf) {
        var enrollment = new SubjectEnrollment({ id: vm.selected.id });
        return enrollment.$delete({ id: vm.selected.id }).then(function () {
          toastr.success('Archived subject enrollment!', 'Enrollment');
          $scope.$broadcast('hateoas.client.refresh');
        });
      }
    }
  }
})();
