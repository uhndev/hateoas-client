(function () {
  'use strict';
  angular.module('dados.common.directives.queryController', [])
    .controller('QueryController', QueryController);

  QueryController.$inject = ['$scope', '$location'];

  function QueryController($scope, $location) {

    // bindable variables
    $scope.query = $scope.query || {};
    $scope.placeholder = $scope.placeholder || 'COMMON.HATEOAS.QUERY.PLACEHOLDER';
    $scope.baseQuery = {};
    $scope.hateoasQueries = $scope.queries || [];
    $scope.operators = [];
    $scope.groupOperators = ['and', 'or'];

    // bindable methods
    $scope.reset = reset;
    $scope.applyQuery = applyQuery;
    $scope.applyPopulate = applyPopulate;
    $scope.search = search;
    $scope.add = add;
    $scope.getFieldType = getFieldType;
    $scope.getFieldTemplate = getFieldTemplate;
    $scope.removeFromQuery = removeFromQuery;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * applyBaseQuery
     * @description Sets whatever baseQuery is currently set to the bound hateoas query
     */
    function applyBaseQuery() {
      _.forIn($scope.baseQuery, function (value, key) {
        $scope.query[key] = value;
      });
    }

    /**
     * reset
     * @description Clears all fields and queries in the queryBuilder
     */
    function reset() {
      $scope.comparator = null;
      $scope.field = null;
      $scope.query = {};
      applyBaseQuery();
    }

    /**
     * applyQuery
     * @description Sets the baseQuery from the selected radio list if applicable of hateoas queries
     * @param query - selected hateoas query object to set
     */
    function applyQuery(query) {
      if (!query) {
        $scope.baseQuery = {};
        $scope.headers = {};
        $scope.reset();
      } else {
        $scope.baseQuery = angular.copy(query);
        applyBaseQuery();
      }
    }

    /**
     * applyPopulate
     * @description Sets the bound headers variable from the selected radio list if applicable of hateoas queries
     * @param populate - selected hateoas populate object to set
     */
    function applyPopulate(populate) {
      if (!populate) {
        $scope.headers = {};
        $scope.reset();
      } else {
        $scope.headers = angular.copy(populate);
      }
    }

    /**
     * search
     * @description Bound function to ng-change on main fuzzy search input, will build an OR array
     *              across all valid template fields with appropriate type contexts.
     * @param value
     */
    function search(value) {
      if (_.isEmpty(value)) {
        $scope.reset();
      } else {
        if (_.isArray($scope.fields)) {
          $scope.query = {
            'or': _.reduce($scope.fields, function(result, field) {
              var query = {};
              switch (true) {
                case /date|dateTime|datetime/i.test(field.type):
                  // dont even bother (╯°□°）╯︵ ┻━┻
                  return result;

                case /integer|number|mrn/i.test(field.type):
                  query[field.name] = parseInt(value, 10);
                  if (!_.isNaN(query[field.name])) {
                    return result.concat(query);
                  }
                  return result;

                case /json|array/i.test(field.type):
                  return result;

                case /string|text/i.test(field.type):
                  query[field.name] = {'contains': value};
                  return result.concat(query);

                case /float/i.test(field.type):
                  query[field.name] = parseFloat(value);
                  if (!_.isNaN(query[field.name])) {
                    return result.concat(query);
                  }
                  return result;

                case /boolean/i.test(field.type):
                  var boolean = (value == 'true' || value == 'True' || value == 'Yes' || value == 'yes');
                  if (boolean) {
                    query[field.name] = boolean;
                    return result.concat(query);
                  }
                  return result;

                default: // otherwise is probably a model id
                  if (_.isNumber(value)) {
                    query[field.name] = parseInt(value);
                    return result.concat(query);
                  } else {
                    return result;
                  }
              }
            }, [])
          };
          applyBaseQuery();
        }
      }
    }

    /**
     * add
     * @description Click handler for adding specific filter in the advanced search
     * @param field
     * @param comparator
     */
    function add(field, comparator) {
      switch (true) {
        case /equals/i.test(comparator) && getFieldType(field.type) === 'date':
          $scope.query[field.name] = new Date(field.value);
          break;
        case /equals/i.test(comparator) && getFieldType(field.type) === 'number':
          $scope.query[field.name] = parseInt(field.value, 10);
          break;
        case /equals/i.test(comparator) || /is/i.test(comparator):
          $scope.query[field.name] = field.value;
          break;
        default:
          var buffer = $scope.query[field.name];

          if (!angular.isObject(buffer)) {
            buffer = {};
          }
          if (!angular.isArray(buffer[comparator]) && buffer[comparator]) {
            buffer[comparator] = [buffer[comparator]];
          }

          if (angular.isArray(buffer[comparator])) {
            buffer[comparator].push(field.value);
          } else {
            buffer[comparator] = field.value;
          }
          $scope.query[field.name] = buffer;
      }
    }

    /**
     * getFieldType
     * @description Helper function for determining what type of field should be rendered
     * @param type
     * @returns {String}
     */
    function getFieldType(type) {
      switch (true) {
        case /date|dateTime|datetime/i.test(type):
          return 'date';
        case /integer|number|float|mrn/i.test(type):
          return 'number';
        case /string|text|json|array/i.test(type):
          return 'text';
        default:
          return type; // if matches none, must be a model type
      }
    }

    /**
     * getFieldTemplate
     * @description Returns appropriate template given a property name
     * @param property
     * @returns {Object}
     */
    function getFieldTemplate(property) {
      var template = _.find($scope.fields, {name: property});
      if (template) {
        template.type = getFieldType(template.type);
        return template;
      } else {
        return {};
      }
    }

    /**
     * removeFromQuery
     * @description Removes a property expression from the waterline query
     * @param property
     */
    function removeFromQuery(property) {
      delete $scope.query[property];
    }
  }
})();
