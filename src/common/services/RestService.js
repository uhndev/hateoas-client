/**
 * Module for communicating with REST API endpoints;
 * uses low level $http calls that return promises.
 */

angular.module('dados.common.services.rest', [])
.service('RestService', RestService);

/**
 * [RestService - Exposes REST endpoints with standard CRUD functions]
 * @param {[type]} $q
 * @param {[type]} $http
 * @param {[type]} config
 * @param {[type]} lodash
 * @param {[type]} $sails
 */
function RestService($q, $http) {

    /**
     * [get - retrieves a collection of generic items]
     * @param  {[type]} url
     * @return {[type]} promise
     */
    this.get = function(url) {
        var deferred = $q.defer();

        $http.get(url).success(function (model) {
            return deferred.resolve(model);
        });

        return deferred.promise;
    };

    /**
     * [create - creates a generic item]
     * @param  {[type]}   url
     * @param  {[type]}   obj - data to pass
     * @param  {Function} next - callback function
     * @return {[type]} promise
     */
    this.create = function(url, obj, next) {
        var deferred = $q.defer();

        $http.post(url, obj).success(function (model) {
            return deferred.resolve(model);
        })
        .error(function (err) {
            return next(err);
        });   

        return deferred.promise;
    };

    /**
     * [update - updates a generic item]
     * @param  {[type]}   model - name of item to update
     * @param  {[type]}   id - id of item
     * @param  {[type]}   obj - modified data to pass
     * @param  {Function} next - callback function
     * @return {[type]} promise
     */
    this.update = function(url, obj, next) {
        var deferred = $q.defer();

        $http.put(url, obj).success(function (model) {
            return deferred.resolve(model);
        })
        .error(function (err) {
            return next(err);
        });

        return deferred.promise;
    };

    /**
     * [destroy - deletes a generic item]
     * @param  {[type]}   model - name of item to delete
     * @param  {[type]}   id - id of item
     * @param  {Function} next - callback function
     * @return {[type]} promise
     */
    this.destroy = function(url, next) {
        var deferred = $q.defer();

        $http['delete'](url).success(function (model) {
            return deferred.resolve(model);
        })
        .error(function (err) {
            return next(err);
        });

        return deferred.promise;
    };

    /**
     * [post - custom method for performing requests for non-api resources]
     * @param  {[type]}   url    [custom url]
     * @param  {[type]}   object [parameters to pass]
     * @param  {Function} next   [callback function]
     * @return {[type]}          [description]
     */
    this.post = function(url, object, next) {
        var deferred = $q.defer();
        $http.post(url, object).success(function (obj) {
            return deferred.resolve(obj);
        })
        .error(function (err) {
            console.log('RestService error:');
            console.log(err);
            return next(err);
        });

        return deferred.promise;
    };
}