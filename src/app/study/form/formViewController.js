(function() {
  'use strict';
  angular
    .module('dados.study.form', [
      'dados.study.service',
      'dados.common.directives.hateoas.controls',
      'dados.common.directives.pluginEditor.formService'
    ])
    .controller('StudyFormController', StudyFormController);

  StudyFormController.$inject = [
    '$scope', '$resource', '$location', 'AuthService', 'toastr', 'API', 'StudyService', 'FormService', 'StudyFormService'
  ];

  function StudyFormController($scope, $resource, $location, AuthService, toastr, API, Study, Form, StudyForm) {
    var vm = this;

    // bindable variables
    vm.study = '';
    vm.forms = Form.query();
    vm.formToAdd = '';
    vm.currStudy = _.getStudyFromUrl($location.path());
    vm.allow = {};
    vm.query = { 'where' : {} };
    vm.selected = null;
    vm.template = {};
    vm.resource = {};
    vm.url = API.url() + $location.path();

    // bindable methods;
    vm.archiveForm = archiveForm;
    vm.onResourceLoaded = onResourceLoaded;
    vm.addFormToStudy = addFormToStudy;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      Study.query({ name: vm.currStudy }).$promise.then(function (data) {
        vm.study = _.first(data).id;
      });
    }

    function onResourceLoaded(data) {
      if (data) {
        // initialize submenu
        AuthService.setSubmenu(vm.currStudy, data, $scope.dados.submenu);
      }
      return data;
    }

    function archiveForm() {
      var conf = confirm("Are you sure you want to archive this form?");
      if (conf) {
        var studyForm = new StudyForm({ formID: vm.selected.id, studyID: vm.study });
        return studyForm.$delete().then(function () {
          toastr.success('Archived form from '+ vm.currStudy + '!', 'Form');
          $scope.$broadcast('hateoas.client.refresh');
        });
      }
    }

    function addFormToStudy() {
      console.log(vm.formToAdd);
      var studyForm = new StudyForm();
      studyForm.formID = vm.formToAdd;
      studyForm.studyID = vm.study;
      studyForm.$save().then(function () {
        toastr.success('Added form to ' + vm.currStudy + '!', 'Form');
        $scope.$broadcast('hateoas.client.refresh');
      });
    }
  }
})();
