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
   * getOperatorsByType
   * @description Returns a list of operators given a field type, used in post-link to
   *              populate scope.operators based on changing field types.
   */
  function getOperatorsByType(type) {
      var operators = {
        'string': [
          {val: 'not', translationKey: 'COMMON.HATEOAS.QUERY.ADVANCED.OPERATORS.NOT'},
          {val: 'is', translationKey: 'COMMON.HATEOAS.QUERY.ADVANCED.OPERATORS.IS'},
          {val: 'contains', translationKey: 'COMMON.HATEOAS.QUERY.ADVANCED.OPERATORS.CONTAINS'},
          {val: 'like', translationKey: 'COMMON.HATEOAS.QUERY.ADVANCED.OPERATORS.LIKE'},
          {val: 'startsWith', translationKey: 'COMMON.HATEOAS.QUERY.ADVANCED.OPERATORS.STARTS_WITH'},
          {val: 'endsWith', translationKey: 'COMMON.HATEOAS.QUERY.ADVANCED.OPERATORS.ENDS_WITH'}
        ],
        'number': [
          {val: 'not', translationKey: 'COMMON.HATEOAS.QUERY.ADVANCED.OPERATORS.NOT'},
          {val: 'equals', translationKey: 'COMMON.HATEOAS.QUERY.ADVANCED.OPERATORS.EQUALS'},
          {val: 'greaterThan', translationKey: 'COMMON.HATEOAS.QUERY.ADVANCED.OPERATORS.GREATER_THAN'},
          {val: 'greaterThanOrEqual', translationKey: 'COMMON.HATEOAS.QUERY.ADVANCED.OPERATORS.GREATER_THAN_OR_EQUAL'},
          {val: 'lessThan', translationKey: 'COMMON.HATEOAS.QUERY.ADVANCED.OPERATORS.LESS_THAN'},
          {val: 'lessThanOrEqual', translationKey: 'COMMON.HATEOAS.QUERY.ADVANCED.OPERATORS.LESS_THAN_OR_EQUAL'}
        ]
      };

      if (!!!type) {
        return [];
      } else {
        if (/integer|float|date/i.test(type)) {
          return operators.number;
        }
      }

      return operators.string;
    }

  /**
   * postLink
   * @description Sets up watchers on changing field types to provide appropriate operators in dropdowns
   * @param scope
   */
  function postLink(scope) {
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
