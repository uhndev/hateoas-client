(function() {
  'use strict';
  angular.module('dados.common.directives.queryController', [])
  .controller('QueryController', QueryController);

  QueryController.$inject = ['$scope'];

  function QueryController($scope) {
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
              if (/date|dateTime/i.test(field.type)) {
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
              else if (/json/i.test(field.type)) {
                // do nothing
                return result;
              }
              else {
                query[field.name] = { 'like': value + '%' };
                if (/integer/i.test(field.type)) {
                  query[field.name] = parseInt(value, 10);
                }
                if (/float/i.test(field.type)) {
                  query[field.name] = parseFloat(value);
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
