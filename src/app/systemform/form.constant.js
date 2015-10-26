(function() {
	'use strict';
	angular
		.module('dados.form.constants', ['dados.constants'])
		.service('FORM_API', Form)
    .service('SYSTEMFORM_API', SystemForm);

    Form.$inject = ['API'];
    SystemForm.$inject = ['API'];

    function Form(API) {
			return { url: API.url() + '/form/:id' };
		}

    function SystemForm(API) {
      return { url: API.url() + '/systemform/:id' };
    }
})();
