(function() {
  'use strict';
  angular
    .module('dados.formbuilder.controller', [])
    .constant('FORM_API', 'http://localhost:1337/api/form/:id')
    .controller('FormBuilderController', FormBuilderController);
  
  FormBuilderController.$inject = ['$location', '$timeout', '$resource', 'toastr', 'FORM_API'];

  function FormBuilderController($location, $timeout, $resource, toastr, FORM_API) {
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
      Resource = $resource(FORM_API, {}, {'update': { method: 'PUT' }});
      // if formURL to load contains a form ID, load it
      if (_.has(query, 'id')) {
        Resource.get(_.pick(query, 'id')).$promise.then(function (form) {
          angular.copy(form.items, vm.form);
          toastr.info('Loaded form '+vm.form.form_name+' successfully!', 'Form');
        }, function (err) {
          toastr.error('Unable to load form! ' + err, 'Form');
        });
      }
    }

    function pushError(err) {
      toastr.error(err, 'Error');
    }

    function saveForm() {
      var resource = new Resource(vm.form);
      // if current form object has an href attribute, we update
      if (_.has(vm.form, 'href')) {
        resource.$update( {id:vm.form.id} ).then(function (data) {
          toastr.success('Updated form '+vm.form.form_name+' successfully!', 'Form');
        }).catch(pushError);        
      } 
      // otherwise, we create a new form
      else {
        resource.$save().then(function (data) {
          toastr.success('Saved form '+vm.form.form_name+' successfully!', 'Form');
        }).catch(pushError);
      }    
    }
  }

})();