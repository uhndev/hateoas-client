(function() {
  'use strict';
  angular
    .module('dados.study.form', [
      'dados.common.directives.hateoas.controls',
      'dados.common.directives.pluginEditor.formService'
    ])
    .controller('StudyFormController', StudyFormController);

  StudyFormController.$inject = [
    '$scope', '$location', 'AuthService', 'toastr', 'API', 'FormService'
  ];

  function StudyFormController($scope, $location, AuthService, toastr, API, Form) {
    var vm = this;

    // private variables
    var currStudy = _.getStudyFromUrl($location.path());

    // bindable variables
    vm.currStudy = '';
    vm.allow = {};
    vm.query = { 'where' : {} };
    vm.selected = null;
    vm.template = {};
    vm.resource = {};
    vm.url = API.url() + $location.path();

    // bindable methods;
    vm.archiveForm = archiveForm;
    vm.onResourceLoaded = onResourceLoaded;

    ///////////////////////////////////////////////////////////////////////////

    function onResourceLoaded(data) {
      if (data) {
        // initialize submenu
        AuthService.setSubmenu(currStudy, data, $scope.dados.submenu);
      }
      return data;
    }

    function archiveForm() {
      var conf = confirm("Are you sure you want to archive this form?");
      if (conf) {
        var form = new Form({ id: vm.selected.id });
        return form.$delete({ id: vm.selected.id }).then(function () {
          toastr.success('Archived form from '+ vm.currStudy + '!', 'Form');
          $scope.$broadcast('hateoas.client.refresh');
        });
      }
    }
  }
})();
