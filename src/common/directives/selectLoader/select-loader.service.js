(function () {
  'use strict';

  angular
    .module('dados.common.directives.selectLoader.service', [
      'sails.io'
    ])
    .service('SelectService', SelectService);

  SelectService.$inject = ['$q', '$http', '$sailsSocket'];

  /**
   * SelectService
   * @description Service for optimizing $http calls when populating resource based dropdowns.  If multiple /user
   *              dropdowns exist on a page, there is no sense in fetching the same data several times, so if the
   *              $location is the same, fetch data from cache.
   * @param $q
   * @param $http
   * @param $sailsSocket
   * @constructor
   */
  function SelectService($q, $http, $sailsSocket) {

    var expiry = 5;
    var cache = {};
    var service = {
      cache: cache,
      expiry: expiry,
      setExpiry: setExpiry,
      fetchCache: fetchCache,
      resetCache: resetCache,
      loadSelect: loadSelect
    };

    return service;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * setExpiry
     * @description Setter function for the cache expiry value
     * @param expiry
     */
    function setExpiry(expiry) {
      service.expiry = expiry;
    }

    /**
     * fetchCache
     * @description Checks local storage for un-expired data and removes data if expired
     * @param httpConfig
     * @returns {Object}
     */
    function fetchCache(httpConfig) {
      var dataCache = service.cache[JSON.stringify(httpConfig)];
      if (_.has(dataCache, 'expiry')) {
        var now = Date.now();
        // delete from cache if timed out
        if (dataCache.expiry < now) {
          delete service.cache[JSON.stringify(httpConfig)];
        } else {
          return dataCache.data;
        }
      } else {
        return dataCache;
      }
    }

    /**
     * resetCache
     * @description Function for performing HTTP call to fetch fresh data, will be called on cache miss.
     *              Will also set expired based on directive expiry attribute.
     * @param httpConfig
     * @returns {Object}
     */
    function resetCache(httpConfig) {
      return $http(httpConfig).then(function (response) {
        //return $sailsSocket.get(httpConfig.url, {params: httpConfig.params}).then(function (response) {
        var results = {
          total: response.data.total,
          items: response.data.items
        };

        var requestKey = JSON.stringify(httpConfig);

        if (angular.isNumber(service.expiry)) {
          var now = new Date();
          service.cache[requestKey] = {
            data: results,
            expiry: new Date(now.getTime() + (60000 * service.expiry))
          };
        } else {
          service.cache[requestKey] = results;
        }

        return results;
      });
    }

    /**
     * loadSelect
     * @description Main entry point function for select service; will parse queries and construct
     *              appropriate httpConfig for $http call.  Will also fetch from cache if available.
     * @param url
     * @param baseQuery
     * @param baseOverride
     * @param query
     * @returns {*}
     * */
    function loadSelect(url, baseQuery, baseOverride, query) {
      var httpConfig = {
        url: url,
        method: 'GET'
      };

      if (query) { // if query given use where contains clause on search string
        httpConfig.params = {
          where: {
            displayName: {'contains': query}
          }
        };
        if (baseQuery) { // if given baseQuery and some additional search string
          _.merge(httpConfig.params.where, baseQuery);
        }
      } else {
        if (baseQuery) { // otherwise if no query given and baseQuery given
          httpConfig.params = {
            where: baseQuery
          };
        }
      }

      // extend config with any baseOverrides
      if (_.isUndefined(httpConfig.params)) {
        httpConfig.params = {};
      }
      _.merge(httpConfig.params, baseOverride);

      var cacheData = service.fetchCache(httpConfig);
      if (cacheData) { // cache hit
        return $q.resolve(cacheData);
      } else { // cache miss
        return service.resetCache(httpConfig);
      }
    }
  }
})();
