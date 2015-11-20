/**
 * @name LocaleLoader
 * @description Custom loader for angular-translate that will in this order:
 *              1) Check local/session/cookie storage for a language key and translations
 *              2) If translations not in local storage, will attempt to fetch from DB via /api/translation
 *              3) If translations not in DB collection, will attempt to fetch from JSON via /api/locale
 *              Fetching anything from the server will cache translations in local storage for future use.
 */
(function() {
  'use strict';

  angular
    .module('dados')
    .factory('localeLoader', localeLoader);

  localeLoader.$inject = [ '$http', '$q', 'localStorageService', 'API' ];

  function localeLoader($http, $q, localStorageService, API) {
    var fallback = function (promise, options) {
      return $http.get(API.url() + '/locale?lang=' + options.key)
        .success(function (data) {
          localStorageService.set(options.key, data);
          return promise.resolve(data);
        })
        .error(function (msg, code) {
          return promise.reject(options.key);
        });
    };

    return function (options) {
      var deferred = $q.defer();

      // fetch translations from local storage
      var localization = localStorageService.get(options.key);

      if (!localization) {
        // hit DB first if translations not found in local-storage to find appropriate translations
        $http.get(API.url() + '/translation?where={"language":"' + options.key + '"}')
          .success(function (data) {
            if (_.isEmpty(data.items)) {
              return fallback(deferred, options);
            } else {
              var translationData = _.first(data.items).translation;
              localStorageService.set(options.key, translationData);
              // resolve with translation data
              return deferred.resolve(translationData);
            }
          })
          .error(function (msg, code) {
            // failing that, try to retrieve from json files on server
            return fallback(deferred, options);
          });
        return deferred.promise;
      } else {
        return $q.when(localization);
      }
    };
  }
})();
