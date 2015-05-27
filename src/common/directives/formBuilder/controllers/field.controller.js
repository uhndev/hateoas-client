(function() {
  'use strict';

  angular
    .module('dados.common.directives.formBuilder.field.controller', [
      'dados.common.directives.selectLoader.service',
      'isteven-multi-select'
    ])
    .controller('FieldController', FieldController);

  FieldController.$inject = ['$scope', '$http', '$timeout', 'SelectService'];

  function FieldController($scope, $http, $timeout, SelectService) {

    // bindable variables
    $scope.multiInput = [];
    $scope.multiOutput = [];
    $scope.loadError = false;

    // bindable methods
    $scope.setValues = setValues;
    $scope.fetchData = fetchData;
    $scope.clearExpr = clearExpr;
    $scope.validateText = validateText;
    $scope.validateNumber = validateNumber;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      if ($scope.field.field_userURL) {
        fetchData();
      }

      var timeoutPromise;
      $scope.$watch("field.field_userURL", function (newVal) {
        if (newVal) {
          $timeout.cancel(timeoutPromise);
          timeoutPromise = $timeout(function() {
            fetchData(false);
          }, 1500);
        }      
      });
    }

    function setValues() {
      if ($scope.field.field_hasItems) {        
        $scope.field.field_value = _.pluck($scope.multiOutput, 'id');
      } 
      else if ($scope.field.field_hasItem) {
        $scope.field.field_value = _.first(_.pluck($scope.multiOutput, 'id'));
      }
    }

    function fetchData(refresh) {
      SelectService.loadSelect($scope.field.field_userURL, refresh).then(function (data) {
        angular.copy(data, $scope.multiInput);
        // set selected values if loading form
        if ($scope.field.field_value) {
          _.each($scope.multiInput, function(item) {
            if (_.isArray($scope.field.field_value)) {
              _.each($scope.field.field_value, function (value) {
                if (item.id === value.id) {
                  item.ticked = true;
                }
              });
            } else {
              if ($scope.field.field_value === item.id) {
                item.ticked = true;
              }
            }
          });
        }
      }).catch(function (err) {
        $scope.loadError = true;
      }); 
    }

    function clearExpr(field) {
      field.field_min = '';
      field.field_max = '';
      field.field_validation.expression = '';
    }

    function validateText(value, field) {
      var expr = field.field_validation.expression;
      var res = true;
      if (value && value.length >= 0) {
        switch (field.field_validation.rule) {
          case 'none':         $scope.showValidateError = false; return true;
          case 'contains':     res = value.indexOf(expr) > -1; break;
          case 'not_contains': res = value.indexOf(expr) <= -1; break;
          case 'min_length':   res = value.length >= expr; break;
          case 'max_length':   res = value.length <= expr; break;
          case 'between':      res = value.length >= expr.min && value.length <= expr.max; break;
          default: break;
        }                
      }
      $scope.showValidateError = !res;
      return res;
    }

    function validateNumber(value, field) {
      var expr = field.field_validation.expression;
      var res = true;
      if (value) {
        switch (field.field_validation.rule) {
          case 'none':        $scope.showValidateError = false; return true;
          case 'gt':          res = value > expr; break;
          case 'geq':         res = value >= expr; break;
          case 'lt':          res = value < expr; break;
          case 'leq':         res = value <= expr; break;
          case 'eq':          res = value == expr; break;
          case 'neq':         res = value != expr; break;
          case 'between':     res = value >= expr.min && value <= expr.max; break;
          case 'not_between': res = value < expr.min || value > expr.max; break;
          default: break;
        }
      }
      $scope.showValidateError = !res;
      return res;
    }
  }

})();
