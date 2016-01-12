(function() {
  'use strict';
  angular.module('dados.common.directives.queryController', [])
  .controller('QueryController', QueryController);

  QueryController.$inject = ['$scope'];

  function QueryController($scope) {
    var TYPE_MAP = {
      "string"    : "textfield",
      "text"      : "textfield",
      "integer"   : "number",
      "float"     : "number",
      "date"      : "date",
      "datetime"  : "date",
      "boolean"   : "checkbox",
      "array"     : "textfield",
      "json"      : "json"
    };

    $scope.query = $scope.query || {};
    $scope.operators = [];
    $scope.groupOperators = ['and', 'or'];

    $scope.reset = function() {
      $scope.value = null;
      $scope.comparator = null;
      $scope.field = null;
      $scope.query = {};
    };

    $scope.search = function(value) {
      if (_.isEmpty(value)) {
        $scope.reset();
      } else {
        if (_.isArray($scope.fields)) {
          $scope.query = {
            'or' : _.reduce($scope.fields, function(result, field) {
              var query = {};
              if (/date|dateTime|datetime/i.test(field.type)) {
                try {
                  var dateObj = new Date(value).toISOString();
                  query[field.name] = { '>=': date, '<': date };
                  result.concat(query);
                } catch(e) {
                  // if value not date, do not concat
                } finally {
                  return result;
                }
              }
              else if (/integer|mrn/i.test(field.type)) {
                query[field.name] = parseInt(value, 10);
                return result.concat(query);
              }
              else{
                switch (field.type) {
                  case 'json':
                    return result; // do nothing
                  case 'array':
                    return result; // do nothing
                  case 'string':
                    query[field.name] = { 'contains': value }; break;
                  case 'float':
                    query[field.name] = parseFloat(value); break;
                  default: // otherwise is probably a model id
                    if (_.isNumber(value)) {
                      query[field.name] = parseInt(value); break;
                    } else {
                      return result;
                    }
                }
                return result.concat(query);
              }
            }, [])
          };
        }
      }
    };

    $scope.add = function (field, comparator, value) {
      if (/equals|is/i.test(comparator)) {
        $scope.query[field] = value;
      } else {
        var buffer = $scope.query[field];

        if (!angular.isObject(buffer)) {
            buffer = {};
        }
        if (!angular.isArray(buffer[comparator]) && buffer[comparator]) {
            buffer[comparator] = [buffer[comparator]];
        }

        if (angular.isArray(buffer[comparator])) {
            buffer[comparator].push(value);
        } else {
            buffer[comparator] = value;
        }
        $scope.query[field] = buffer;
      }
    };
  }
})();
