/**
 * @name employee-editor
 * @description Angular component that abstracts the functionality for editing employee information
 * @example <employee-editor horizontal="true" employee="employee"></employee-editor>
 */

(function() {
  'use strict';

  angular
    .module('dados.common.directives.employeeEditor', [])
    .controller('EmployeeEditorController', EmployeeEditorController)
    .component('employeeEditor', {
      bindings: {
        horizontal: '@?',
        employee: '='
      },
      templateUrl: 'directives/modelEditors/employeeEditor/employee-editor.tpl.html',
      controller: 'EmployeeEditorController',
      controllerAs: 'employee'
    });

  EmployeeEditorController.$inject = ['PersonService'];

  function EmployeeEditorController(Person) {
    var vm = this;

    // bindable variables
    vm.employee = vm.employee || {};
    vm.horizontal = vm.horizontal == 'true' || false;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      if (_.has(vm.employee, 'id') && vm.employee.person && !_.has(vm.employee.person, 'id')) {
        Person.get({id: vm.employee.person}, function (person) {
          vm.employee.person = _.pick(person, 'prefix', 'firstName', 'middleName', 'lastName');
        });
      }
    }

  }

})();
