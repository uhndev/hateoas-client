(function () {
  'use strict';

  angular
    .module('dados.common.directives.selectLoader.service', ['sails.io'])
    .service('SelectService', SelectService);

  SelectService.$inject = ['$http', '$sailsSocket'];

  /**
   * SelectService
   * @description Service for optimizing $http calls when populating resource based dropdowns.  If multiple /user
   *              dropdowns exist on a page, there is no sense in fetching the same data several times, so if the
   *              $location is the same, fetch data from cache.
   * @param $http
   * @param $sailsSocket
   * @constructor
   */
  function SelectService($http, $sailsSocket) {
    this.loadSelect = function (url, baseQuery, baseOverride, query) {
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

      return $http(httpConfig).then(function (response) {
      //return $sailsSocket.get(httpConfig.url, {params: httpConfig.params}).then(function (response) {
        return {
          total: response.data.total,
          items: response.data.items
        };
      });
    };
  }
})();
