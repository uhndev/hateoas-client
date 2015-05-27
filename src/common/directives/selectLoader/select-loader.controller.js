(function() {
	'use strict';

	angular
		.module('dados.common.directives.selectLoader.controller', [
      'isteven-multi-select',
			'dados.common.directives.hateoas',
      'dados.common.directives.selectLoader.service'			
		])
		.controller('SelectController', SelectController);

	SelectController.$inject = ['$scope', '$http', 'API', 'SelectService'];

	function SelectController($scope, $http, API, SelectService) {
		var vm = this;

		// bindable variables
		vm.url = (vm.url) ? API.url() + '/' + vm.url : API.url() + '/user'; // use user resource by default
    vm.input = vm.input || [];
    vm.output = vm.output || [];
    vm.values = (vm.isAtomic) ? (vm.values || '') : (vm.values || []);
    vm.labels = vm.labels || 'name';
    vm.outputProperties = vm.outputProperties || 'id';

    // bindable methods
    vm.setValues = setValues;
    vm.fetchData = fetchData;
    
    fetchData(false);

    ///////////////////////////////////////////////////////////////////////////

    function setValues() {
      if (vm.isAtomic === 'true') {
      	vm.values = _.first(_.pluck(vm.output, 'id'));        
      } else {
        vm.values = _.pluck(vm.output, 'id');
      }
    }

    function fetchData(refresh) {
      SelectService.loadSelect(vm.url, refresh).then(function (data) {
        angular.copy(data, vm.input);
        // set selected values if loading form
        if (!_.isEmpty(vm.values)) {
          if (vm.isAtomic === 'true') {
            _.each(vm.input, function(item) {
              if (vm.values === item.id) {
                item.ticked = true;
              }
            });
          } else {
            _.map(vm.input, function(item) {
              if (_.inArray(vm.values, item.id)) {
                item.ticked = true;
              }
            });
          }
        }
      });
    }
	}

})();