(function() {
	'use strict';

	angular
		.module('dados.common.directives.selectLoader.service', [])
		.service('SelectService', SelectService);

	SelectService.$inject = ['$http', '$q', '$location'];

	/**
   * SelectService
   * @description Service for optimizing $http calls when populating resource based dropdowns.  If multiple /user
   *              dropdowns exist on a page, there is no sense in fetching the same data several times, so if the
   *              $location is the same, fetch data from cache.
   * @param $http
   * @param $q
   * @param $location
   * @constructor
	 */
	function SelectService($http, $q, $location) {
		var cache = {};
    var currentLocation = null;

		this.loadSelect = function(url, query) {
			var deferred;
      if (currentLocation !== $location.path()) {
        cache = {};
      }

			if (!cache[url] || (cache[url] && currentLocation !== $location.path())) {
        var httpConfig = {
          url: url,
          method: 'GET'
        };
        if (query) {
          httpConfig.params = {
            where: {
              displayName: {
                'contains': query
              }
            }
          };
        }
				cache[url] = $http(httpConfig).then(function(response) {
					return response.data.items;
				});
        currentLocation = $location.path();
				return cache[url];
			} else {
        deferred = $q.defer();
        deferred.resolve(cache[url]);
        currentLocation = $location.path();
        return deferred.promise;
			}
		};
	}
})();
