(function() {
	'use strict';

	angular
		.module('dados.common.directives.selectLoader.service', [])
		.service('SelectService', SelectService);

	SelectService.$inject = ['$http', '$q'];

	function SelectService($http, $q) {
		var cache = {};

		this.loadSelect = function(url, refresh) {
			var deferred;
			if (!cache[url] || refresh) {
				cache[url] = $http.get(url).then(function(response) {
					return response.data.items;
				});
				return cache[url];
			} else {
				deferred = $q.defer();
				deferred.resolve(cache[url]);
				return deferred.promise;
			}
		};
	}
})();