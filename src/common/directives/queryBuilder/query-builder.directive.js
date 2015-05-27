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
})();
