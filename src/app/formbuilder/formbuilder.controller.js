(function() {
  'use strict';
  angular
    .module('dados.formbuilder.controller', ['dados.form.constants'])
    .controller('FormBuilderController', FormBuilderController);

  FormBuilderController.$inject = ['$location', '$timeout', '$resource', 'toastr', 'SYSTEMFORM_API'];

  function FormBuilderController($location, $timeout, $resource, toastr, SYSTEMFORM_API) {
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
      Resource = $resource(SYSTEMFORM_API.url, {}, {'update': { method: 'PUT' }});
      // if formURL to load contains a form ID, load it
      if (_.has(query, 'id')) {
        Resource.get(_.pick(query, 'id')).$promise.then(function (form) {
          angular.copy(form.items, vm.form);
          toastr.info('Loaded form '+vm.form.form_name+' successfully!', 'Form');
        });
      }
    }

    function saveForm() {
      var resource = new Resource(vm.form);
      // if current form object has an href attribute, we update
      if (_.has(vm.form, 'href')) {
        resource.$update( {id:vm.form.id} ).then(function (data) {
          toastr.success('Updated form '+vm.form.form_name+' successfully!', 'Form');
        });
      }
      // otherwise, we create a new form
      else {
        resource.$save().then(function (data) {
          toastr.success('Saved form '+vm.form.form_name+' successfully!', 'Form');
        });
      }
    }
  }

})();
