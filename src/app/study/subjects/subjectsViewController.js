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
    '$scope', '$location', '$uibModal', 'HeaderService', 'toastr',
    'API', 'StudyService', 'SubjectEnrollmentService', 'SubjectService'
  ];

  function StudySubjectController($scope, $location, $uibModal, HeaderService, toastr,
                                  API, Study, SubjectEnrollment, Subject) {

    var vm = this;

    // private variables
    var studyID = _.getStudyFromUrl($location.path());
    var centreHref = "study/" + studyID + "/collectioncentres";

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

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Private Methods
     */

    function loadModal(type) {
      var modalSettings = {
        animation: true,
        templateUrl: 'study/subjects/' + type + 'SubjectModal.tpl.html',
        controller: _.capitalize(type) + 'SubjectController',
        controllerAs: type + 'Subject',
        bindToController: true,
        resolve: {
          study: function () {
            return Study.get({ id: studyID }).$promise;
          },
          centreHref: function () {
            return centreHref;
          }
        }
      };

      if (type === 'edit') {
        modalSettings.resolve.subject = function() {
          var subject = angular.copy(vm.selected);
          // check for invalid doe dates
          if (_.isUndefined(subject.doe)) {
            delete subject.doe;
          } else {
            if (angular.isString(subject.doe)) {
              subject.doe = new Date(subject.doe);
            }
          }
          return subject;
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
        Study.get({ id: studyID }).$promise.then(function (study) {
          HeaderService.setSubmenu({
            prompt: study.displayName,
            value: studyID,
            rel: 'study'
          }, data, $scope.dados.submenu);
        });
      }
      return data;
    }

    function openSubject() {
      if (vm.selected.rel) {
        $location.path(_.convertRestUrl(vm.selected.href, API.prefix));
      }
    }

    function openAddSubject() {
      $uibModal.open(loadModal('add')).result.then(function () {
        $scope.$broadcast('hateoas.client.refresh');
      });
    }

    function openEditSubject() {
      $uibModal.open(loadModal('edit')).result.then(function () {
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
