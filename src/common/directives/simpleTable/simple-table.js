(function() {
  'use strict';
  angular
    .module('dados.common.directives.simpleTable', [
      'dados.common.directives.selectLoader'
    ])
    .component('simpleTable', {
      bindings: {
        rows: '=',
        tableData: '='
      },
      templateUrl: 'directives/simpleTable/simpleTable.tpl.html',
      controller: TableController,
      controllerAs: 'table'
    });

  TableController.$inject = ['$scope'];

  function TableController($scope) {
    var vm = this;

    // bindable variables
    // each row has field: { title, type }
    vm.rows = vm.rows || [];
    // each tableData has name value pair
    vm.tableData = vm.tableData || [];
  }

})();
