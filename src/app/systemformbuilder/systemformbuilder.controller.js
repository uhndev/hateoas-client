(function() {
  'use strict';
  angular
    .module('dados.systemformbuilder.controller', ['dados.form.service'])
    .controller('FormBuilderController', FormBuilderController);

  FormBuilderController.$inject = ['$location', '$timeout', '$resource', 'toastr', 'SystemFormService'];

  function FormBuilderController($location, $timeout, $resource, toastr, SystemFormService) {
    var vm = this;
    var Resource;

    // bindable variables
    vm.form = {};
    // bindable methods
    vm.saveForm = saveForm;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var query = $location.search();
      // if formURL to load contains a form ID, load it
      if (_.has(query, 'id')) {
        SystemFormService.get(_.pick(query, 'id')).$promise.then(function (form) {
          angular.copy(form, vm.form);
          toastr.info('Loaded form '+vm.form.form_name+' successfully!', 'Form');
        });
      }
    }

    function saveForm() {
      var form = new SystemFormService(vm.form);
      // if current form object has an href attribute, we update
      if (_.has(vm.form, 'href')) {
        form.$update( {id:vm.form.id} ).then(function (data) {
          toastr.success('Updated form '+vm.form.form_name+' successfully!', 'Form');
        });
      }
      // otherwise, we create a new form
      else {
        form.$save().then(function (data) {
          toastr.success('Saved form '+vm.form.form_name+' successfully!', 'Form');
        });
      }
    }
  }

})();
