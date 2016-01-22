(function() {
  'use strict';

  angular
  .module('dados.common.directives.selectLoader.controller', [
        'ui.select',
  'dados.constants',
        'dados.common.directives.selectLoader.service'
  ])
  .controller('SelectController', SelectController);

  SelectController.$inject = ['$scope', 'API', 'SelectService'];

  function SelectController($scope, API, SelectService) {
    var vm = this;

    // bindable variables
    vm.loadError = false;
    vm.href = (vm.url) ? API.url() + '/' + vm.url : API.url() + '/user'; // use user resource by default
    vm.input = vm.input || [];
    vm.baseQuery = vm.query || null;
    vm.labels = vm.labels || 'name';

    // bindable methods
    vm.fetchData = fetchData;

    fetchData();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      if (vm.isAtomic) {
        vm.values = vm.values || '';
      } else {
        vm.values = vm.values || [];
        if (!_.isArray(vm.values)) {
          vm.values = [vm.values];
        }
      }
    }

    /**
         * fetchData
         * @description Refresh function called to fetch data on load and search updates.
         * @param query Sails search query to pass through
         */
    function fetchData(query, select) {
      SelectService.loadSelect(vm.href, vm.baseQuery, query).then(function (data) {
        vm.input = data;
        if (select) { // bugfix for ui-select. See https://github.com/angular-ui/ui-select/issues/962
          select.refreshItems();
        }
      }).catch(function (err) {
        vm.loadError = true;
        $scope.$parent.loadError = true;
      });
    }
  }

})();
