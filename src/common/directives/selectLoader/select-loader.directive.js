(function() {
	'use strict';

	angular
		.module('dados.common.directives.selectLoader', [
			'dados.common.directives.selectLoader.controller'
		])
		.directive('selectLoader', selectLoader);

	selectLoader.$inject = ['$compile'];

	function selectLoader($compile) {
		return {
			restrict: 'E',
			scope: {
				url: '@',
				isAtomic: '=',
				isDisabled: '=',
				values: '=',
				labels: '@',
				outputProperties: '@'
			},
			templateUrl: 'directives/selectLoader/select-loader.tpl.html',
			controller: 'SelectController',
			controllerAs: 'select',
			bindToController: true,
			link: function (scope, elem, attr, ctrl) {
				
				var unreg = scope.$watchCollection('select.input', function (newVal) {
					if (newVal && !_.isEmpty(newVal)) {
						if (scope.select.isDisabled) {
							var items = _.filter(ctrl.input, 'ticked');
							var labels = ctrl.labels.split(' ');
							var output = _.map(items, function (item) {
								return _.reduce(labels, function(res, label) {
									res.push(item[label]); 
									return res; 
								}, []).join(' ');	
							});
							
					    var html = '<p>' + output.join(', ') + '</p>';
			        var e = $compile(html)(scope);
			        elem.replaceWith(e);
						}
						unreg();
					}
				});
			}
		};
	}
})();