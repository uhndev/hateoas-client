(function() {
  'use strict';
  angular
    .module('dados.common.directives.queryBuilder', [
      'dados.common.directives.queryController'
    ])
    .directive('queryBuilder', function() {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          query: '=ngModel',
          template: '&'
        },
        link: postLink,
        templateUrl: 'directives/queryBuilder/query-builder.tpl.html',
        controller: 'QueryController'
      };
    });

    /**
     * Returns a list of operators given a field type.
     */
    function getOperatorsByType(type) {
      var operators = {
        'string': [
          { val: 'not', translationKey: 'HATEOAS.QUERY.ADVANCED.OPERATORS.NOT' },
          { val: 'is', translationKey: 'HATEOAS.QUERY.ADVANCED.OPERATORS.IS' },
          { val: 'contains', translationKey: 'HATEOAS.QUERY.ADVANCED.OPERATORS.CONTAINS' },
          { val: 'like', translationKey: 'HATEOAS.QUERY.ADVANCED.OPERATORS.LIKE' },
          { val: 'startsWith', translationKey: 'HATEOAS.QUERY.ADVANCED.OPERATORS.STARTS_WITH' },
          { val: 'endsWith', translationKey: 'HATEOAS.QUERY.ADVANCED.OPERATORS.ENDS_WITH' }
        ],
        'number': [
          { val: 'not', translationKey: 'HATEOAS.QUERY.ADVANCED.OPERATORS.NOT' },
          { val: 'equals', translationKey: 'HATEOAS.QUERY.ADVANCED.OPERATORS.EQUALS' },
          { val: 'greaterThan', translationKey: 'HATEOAS.QUERY.ADVANCED.OPERATORS.GREATER_THAN' },
          { val: 'greaterThanOrEqual', translationKey: 'HATEOAS.QUERY.ADVANCED.OPERATORS.GREATER_THAN_OR_EQUAL' },
          { val: 'lessThan', translationKey: 'HATEOAS.QUERY.ADVANCED.OPERATORS.LESS_THAN' },
          { val: 'lessThanOrEqual', translationKey: 'HATEOAS.QUERY.ADVANCED.OPERATORS.LESS_THAN_OR_EQUAL' }
        ]
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
          if (!_.isEqual(angular.toJson(newTemplate), angular.toJson(oldTemplate))) {
            scope.fields = scope.template().data;
            scope.reset();
          }
        });
    }
})();
