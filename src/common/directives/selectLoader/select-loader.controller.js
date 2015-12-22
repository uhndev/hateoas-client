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
    vm.values = (vm.isAtomic) ? (vm.values || '') : (vm.values || []);
    vm.labels = vm.labels || 'name';

    // bindable methods
    vm.fetchData = fetchData;

    fetchData();

    ///////////////////////////////////////////////////////////////////////////

    function fetchData(query) {
      SelectService.loadSelect(vm.href, query).then(function (data) {
        angular.copy(data, vm.input);
      }).catch(function (err) {
        vm.loadError = true;
        $scope.$parent.loadError = true;
      });
    }
	}

})();
