(function() {
	'use strict';
	angular
		.module('dados.constants', [
			'dados.common.config'
		])
		.service('API', API);

	API.$inject = ['BASE'];
	function API(BASE) {
		return _.merge(BASE, {
			base: function getBase() {
				return BASE.protocol + "://" + BASE.host + ":" + BASE.port;
			},
			url: function getUrl() {
				return this.base() + BASE.prefix;
			},
			csrfToken: function getToken() {
				return this.base() + '/csrfToken';
			}
		});
	}

})();