angular.module('hateoas.queryBuilder',[])
  .directive('queryBuilder', ['$http',
  
  function queryBuilder() {
    //@link https://github.com/balderdashy/waterline-criteria/blob/master/lib/filters/where.js
    function searchController ($scope, $http) {
      $scope.query = {};
      $scope.groupOperators = [ 'and', 'or' ];
      $scope.criteria = [
        'not',
        'greaterThan',
        'greaterThanOrEqual',
        'lessThan',
        'lessThanOrEqual',
        'startsWith',
        'endsWith',
        'contains',
        'like'];

      $scope.search = function() {
        
      };
    }

    function postLink (scope, element, attribute, controller) {
      var response = scope.response();
      var api = response.href;
      scope.fields = response.template.data;
    }

    return {
      restrict: 'E',
      scope: {
        response: '&',
        callback: '&'
      },
      link: postLink
    };
  }

]);
