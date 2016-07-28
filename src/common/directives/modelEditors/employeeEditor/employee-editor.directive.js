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
      controllerAs: 'employeeEditor'
    });

  EmployeeEditorController.$inject = ['PersonService', 'EmployeeService', 'toastr'];

  function EmployeeEditorController(Person, Employee, toastr) {
    var vm = this;

    // bindable variables
    vm.employee = vm.employee || {};
    vm.horizontal = vm.horizontal == 'true' || false;

    // bindable methods
    vm.updateEmployee = updateEmployee;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      if (_.has(vm.employee, 'id') && vm.employee.person && !_.has(vm.employee.person, 'id')) {
        Person.get({id: vm.employee.person}, function (person) {
          vm.employee.person = _.pick(person, 'id', 'prefix', 'firstName', 'middleName', 'lastName');
        });
      }
    }

    /**
     * updateEmployee
     * @description Click handler for updating employees and saving employees to collections
     */
    function updateEmployee() {
      if (vm.employee.id) {
        Employee.update(vm.employee, function (data) {
          toastr.success('Employee successfully updated!', 'Employee');
        });
      }
    }

  }

})();
