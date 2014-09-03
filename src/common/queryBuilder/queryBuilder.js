angular.module('hateoas.queryBuilder', [])
  .directive('queryBuilder', function() {

  function queryController($scope) {
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

  /**
   * Returns a list of operators given a field type.
   */
  function getOperatorsByType(type) {
    var operators = {
      'string': ['not', 'is', 'contains', 'like', 
        'startsWith', 'endsWith'],
      'number': ['not', 'equals', 
        'greaterThan', 'greaterThanOrEqual', 
        'lessThan', 'lessThanOrEqual']
    };
  
    if (!!!type) {
      return [];
    } else {
      if (/integer|float|date/i.test(type)) {
        return operators['number'];
      }
    }

    return operators['string'];
  }

  function postLink(scope, element, attribute, controller) {
    if (scope.template()) {
      scope.advanceSearch = 0;
      scope.fields = scope.template().data;
    }

    scope.$watch('advanceSearch', scope.reset);
    scope.$watch('field.type', function(type) {
      scope.operators = getOperatorsByType(type);
    });

    scope.$watchCollection('template().data', 
      function(newTemplate, oldTemplate) {
        if (!_.isEqual(newTemplate, oldTemplate)) {
          scope.fields = scope.template().data;
          scope.reset();
        }
      });
  }

  return {
    restrict: 'E',
    replace: true,
    scope: {
      query: '=ngModel',
      template: '&'
    },
    link: postLink,
    templateUrl: 'queryBuilder/queryBuilder.tpl.html',
    controller: ['$scope', queryController]
  };
});
