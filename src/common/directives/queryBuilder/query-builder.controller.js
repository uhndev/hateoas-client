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
            'or' : _.map($scope.fields, function(field) {
              var query = {};
              query[field.name] = { 'like': value + '%' };
  
              if (/integer/i.test(field.type)) {
                query[field.name] = parseInt(value, 10);
              }
  
              if (/float/i.test(field.type)) {
                query[field.name] = parseFloat(value);
              }
  
              if (/date|dateTime/i.test(field.type)) {
                try {
                  query[field.name] = new Date(value).toISOString();
                } catch(e) {

                }
              }
              return query;
            })
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