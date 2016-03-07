(function() {
  'use strict';
  angular.module('dados.common.directives.queryController', [])
  .controller('QueryController', QueryController);

  QueryController.$inject = ['$scope', '$location'];

  function QueryController($scope, $location) {

    var systemTypes = [];

    // bindable variables
    $scope.query = $scope.query || {};
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
      _.forIn($scope.baseQuery, function(value, key) {
        $scope.query[key] = value;
      });
    }

    /**
     * reset
     * @description Clears all fields and queries in the queryBuilder
     */
    function reset() {
      if ($scope.field) {
        $scope.field.value = null;
      }
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
            'or' : _.reduce($scope.fields, function(result, field) {
              var query = {};
              if (/date|dateTime|datetime/i.test(field.type)) {
                try {
                  var dateObj = new Date(value).toISOString();
                  query[field.name] = {'>=': date, '<': date};
                  result.concat(query);
                } catch (e) {
                  // if value not date, do not concat
                } finally {
                  return result;
                }
              }
              else if (/integer|number|mrn/i.test(field.type)) {
                query[field.name] = parseInt(value, 10);
                return result.concat(query);
              }
              else {
                switch (field.type) {
                  case 'json':
                    return result; // do nothing
                  case 'array':
                    return result; // do nothing
                  case 'string':
                    query[field.name] = {'contains': value}; break;
                  case 'float':
                    query[field.name] = parseFloat(value); break;
                  default: // otherwise is probably a model id
                    if (_.isNumber(value)) {
                      query[field.name] = parseInt(value); break;
                    } else {
                      return result;
                    }
                }
                return result.concat(query);
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
      if (/equals/i.test(comparator)) {
        if (!/date|dateTime|datetime/i.test(field.type)) {
          $scope.query[field.name] = parseInt(field.value, 10);
        } else {
          $scope.query[field.name] = new Date(field.value);
        }
      } else if (/is/i.test(comparator)) {
        $scope.query[field.name] = field.value;
      } else {
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
      if (/date|dateTime|datetime/i.test(type)) {
        return 'date';
      } else if (/integer|number|float|mrn/i.test(type)) {
        return 'number';
      } else if (/string|text|json|array/i.test(type)) {
        return 'string';
      } else { // if matches none, must be a model type
        return type;
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
