(function () {
  'use strict';

  angular
    .module('dados.common.directives.queryController')
    .service('QueryParser', QueryParser);

  QueryParser.$inject = [];

  function QueryParser() {

    var service = {
      evaluate: evaluate
    };

    return service;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * evaluate
     * @description Evaluates a waterline query against a data object
     * @param whereClause
     * @param object
     */
    function evaluate(whereClause, object) {
      return _.reduce(whereClause, function (result, subClause, fieldName) {
        if (_.isNumber(subClause)) {
          result = object[fieldName] == subClause;
        } else {
          result = result && _.reduce(subClause, function (subResult, clauseValue, operator) {
              switch (operator) {
                case 'not':
                  subResult = subResult && object[fieldName] != clauseValue; break;
                case 'is':
                  subResult = subResult && object[fieldName] == clauseValue; break;
                case 'contains':
                  subResult = subResult && _.stringContains(object[fieldName], clauseValue); break;
                case 'like':
                  subResult = subResult && _.stringContains(object[fieldName], clauseValue); break;
                case 'startsWith':
                  subResult = subResult && object[fieldName].startsWith(clauseValue); break;
                case 'endsWith':
                  subResult = subResult && object[fieldName].endsWith(clauseValue); break;
                case 'equals':
                  subResult = subResult && object[fieldName] === clauseValue; break;
                case 'greaterThan':
                  subResult = subResult && object[fieldName] > clauseValue; break;
                case 'greaterThanOrEqual':
                  subResult = subResult && object[fieldName] >= clauseValue; break;
                case 'lessThan':
                  subResult = subResult && object[fieldName] < clauseValue; break;
                case 'lessThanOrEqual':
                  subResult = subResult && object[fieldName] <= clauseValue; break;
                default: break;
              }
              return subResult;
            }, true);
        }

        return result;
      }, true);
    }
  }

})();

