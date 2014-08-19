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
    $scope.query = {};

    $scope.criteria = {
      'string': ['not', 'is', 'contains', 'like', 
        'startsWith', 'endsWith'],
      'integer': ['not', 'equals', 
        'greaterThan', 'greaterThanOrEqual', 
        'lessThan', 'lessThanOrEqual']
    };
  
    $scope.groupOperators = ['and', 'or'];
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
      scope.fields = scope.template().data;
    }
  }

  return {
    restrict: 'E',
    scope: {
      template: '&',
      callback: '&'
    },
    link: postLink,
    templateUrl: 'directives/queryBuilder/queryBuilder.tpl.html',
    controller: queryController
  };
});
