(function() {
	'use strict';	
	
	angular.module('dados.header.directive', [])
	.directive('dadosHeader', function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				submenu: '='
			},
			templateUrl: 'header/dados-header.tpl.html',
			controller: 'HeaderController',
			controllerAs: 'header',
			bindToController: true
		};
	});

})();