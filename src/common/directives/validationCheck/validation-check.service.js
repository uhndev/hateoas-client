(function() {
  'use strict';

  angular
    .module('dados.common.directives.validationCheck')
    .factory('modelValidator', modelValidator);

  modelValidator.$inject = ['API', '$http'];

  function modelValidator(API, $http) {

    var validator = {
      isUnique: isUnique
    };

    return validator;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * isUnique
     * @description Queries backend with given criteria to see if record is unique
     * @param modelName name of model to query
     * @param query     waterline query to validate with
     * @returns {Object|Promise}
     * */
    function isUnique(modelName, query) {
      return $http({
        url: API.url() + '/checkexists/' + modelName,
        method: 'GET',
        params: query
      }).then(function (results) {
        return results.data.status;
      });
    }
  }

})();
