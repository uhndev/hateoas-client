(function() {
	'use strict';
	angular
		.module('dados.form.constants', ['dados.constants'])
		.service('FORM_API', Form);
		Form.$inject = ['API'];
		function Form(API) {
			return { url: API.url() + '/form/:id' };
		}
})();