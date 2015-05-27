(function() {
	'use strict';

	angular.module('dados.common.directives.formBuilder', [
		'ui.sortable',
		'ui.validate',
		'ui.bootstrap',
		'dados.common.directives.formBuilder.controller',
		'dados.common.directives.formBuilder.field.controller',
		'dados.common.directives.formBuilder.service',
		'dados.common.directives.formBuilder.directives'
	]);
})();