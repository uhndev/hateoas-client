(function() {
	'use strict';
	angular
		.module('dados.workflow.constants', ['dados.constants'])
		.service('WORKFLOWSTATE_API', Workflow);
		Workflow.$inject = ['API'];
		function Workflow(API) {
			return { url: API.url() + '/workflowState' };
		}
})();
