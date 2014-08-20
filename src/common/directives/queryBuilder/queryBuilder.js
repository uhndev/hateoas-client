angular.module('hateoas.queryBuilder', [])
  .filter('isArray', function () {
    return angular.isArray;
  })
  .filter('isObject', function () {
    return angular.isObject;
  })
  .filter('isString', function () {
    return angular.isString;
  })
  .directive('queryBuilder', function() {

  function queryController($scope) {
    $scope.query = $scope.query || {};

    $scope.criteria = {
      'string': ['not', 'is', 'contains', 'like', 
        'startsWith', 'endsWith'],
      'integer': ['not', 'equals', 
        'greaterThan', 'greaterThanOrEqual', 
        'lessThan', 'lessThanOrEqual']
    };
  
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
              query[field.rel] = { 'like': value + '%' };
  
              if (/integer/i.test(field.type)) {
                query[field.rel] = parseInt(value, 10);
              }
  
              if (/float/i.test(field.type)) {
                query[field.rel] = parseFloat(value);
              }
  
              if (/date|dateTime/i.test(field.type)) {
                try {
                  query[field.rel] = new Date(value).toISOString();
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

  function postLink(scope, element, attribute, controller) {
    if (scope.template()) {
      scope.advanceSearch = 0;
      scope.fields = scope.template().data;
    }

    scope.$watch('advanceSearch', scope.reset);
  }

  return {
    restrict: 'E',
    replace: true,
    scope: {
      query: '=ngModel',
      template: '&'
    },
    link: postLink,
    templateUrl: 'directives/queryBuilder/queryBuilder.tpl.html',
    controller: queryController
  };
});
