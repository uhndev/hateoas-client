(function() {
	'use strict';

	angular
		.module('dados.common.directives.selectLoader', [
			'dados.common.directives.selectLoader.controller'
		])
		.directive('selectLoader', selectLoader);

	function selectLoader() {
		return {
			restrict: 'E',
			scope: {
				url: '@',
				isAtomic: '@',
				isDisabled: '@',
				values: '=',
				labels: '@',
				outputProperties: '@'
			},
			templateUrl: 'directives/selectLoader/select-loader.tpl.html',
			controller: 'SelectController',
			controllerAs: 'select',
			bindToController: true
		};
	}
})();