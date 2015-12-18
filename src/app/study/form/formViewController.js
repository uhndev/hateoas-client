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
    '$scope', '$location', 'HeaderService', 'toastr', 'API', 'StudyService', 'FormService', 'StudyFormService'
  ];

  function StudyFormController($scope, $location, HeaderService, toastr, API, Study, Form, StudyForm) {
    var vm = this;

    // private variables
    var studyID = _.getStudyFromUrl($location.path());

    // bindable variables
    vm.forms = [];
    vm.formToAdd = '';
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

    ///////////////////////////////////////////////////////////////////////////

    function onResourceLoaded(data) {
      if (data) {
        // initialize submenu
        Study.get({ id: studyID }).$promise.then(function (study) {
          HeaderService.setSubmenu({
            prompt: study.name,
            value: studyID,
            rel: 'study'
          }, data, $scope.dados.submenu);
        });

        // populate add form dropdown with forms not already added
        var filterQuery = {};
        if (!_.isEmpty(data.items)) {
          filterQuery.where = { 'id': { '!': _.pluck(data.items, 'id') } };
        }
        vm.forms = Form.query(filterQuery);
      }
      return data;
    }

    function archiveForm() {
      var conf = confirm("Are you sure you want to archive this form?");
      if (conf) {
        var studyForm = new StudyForm({ formID: vm.selected.id, studyID: studyID });
        return studyForm.$delete().then(function () {
          toastr.success('Archived form from study '+ studyID + '!', 'Form');
          $scope.$broadcast('hateoas.client.refresh');
        });
      }
    }

    function addFormToStudy() {
      var studyForm = new StudyForm();
      studyForm.formID = vm.formToAdd;
      studyForm.studyID = studyID;
      studyForm.$save().then(function () {
        toastr.success('Added form to study ' + studyID + '!', 'Form');
        vm.formToAdd = null;
        $scope.$broadcast('hateoas.client.refresh');
      });
    }
  }
})();
