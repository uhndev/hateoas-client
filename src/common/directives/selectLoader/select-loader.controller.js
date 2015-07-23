(function() {
	'use strict';

	angular
		.module('dados.common.directives.selectLoader.controller', [
      'isteven-multi-select',
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
      if (vm.isAtomic) {
      	vm.values = _.first(_.pluck(vm.output, 'id'));
      } else {
        vm.values = _.pluck(vm.output, 'id');
      }
    }

    function fetchData(refresh) {
      if (!_.isUrl(vm.href)) {
        vm.href = (vm.url) ? API.url() + '/' + vm.url : API.url() + '/user';
      }

      SelectService.loadSelect(vm.href, refresh).then(function (data) {
        angular.copy(data, vm.input);
        _.map(vm.input, function(inp) { delete inp.ticked; return inp; });
        // set selected values if loading form
        if (!_.isNull(vm.values)) {
          if (vm.isAtomic) {
            _.each(vm.input, function(item) {
              if (vm.values === item.id) {
                item.ticked = true;
              }
            });
          } else {
            var values = vm.values;
            if (_.all(vm.values, _.has('id'))) {
              values = _.pluck(vm.values, 'id');
            }
            _.map(vm.input, function(item) {
              if (_.inArray(values, item.id)) {
                item.ticked = true;
              }
            });
          }
        }
      }).catch(function (err) {
        vm.loadError = true;
        $scope.$parent.loadError = true;
      });
    }
	}

})();
