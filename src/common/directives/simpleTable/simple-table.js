(function() {
  'use strict';
  angular
    .module('dados.common.directives.simpleTable', [])
    .directive('simpleTable', function() {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          columns: '=',
          tableData: '='
        },
        template: '<table class="table table-hover">'+
          '<thead>'+
            '<tr>'+
              '<th ng-repeat="col in table.columns">{{col}}</th>'+
            '</tr>'+
          '</thead>'+
          '<tbody>'+
            '<tr ng-repeat="item in table.tableData">'+
              '<td>{{item.name}}</td>'+
              '<td>{{item.value}}</td>'+
            '</tr>'+
          '</tbody>'+
        '</table>',
        controller: TableController,
        controllerAs: 'table',
        bindToController: true
      };
    });

  TableController.$inject = [];

  function TableController() {
    var vm = this;

    // bindable variables
    vm.columns = vm.columns || [];
    vm.tableData = vm.tableData || [];
  }

})();