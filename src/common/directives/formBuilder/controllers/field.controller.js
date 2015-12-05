(function() {
  'use strict';

  angular
    .module('dados.common.directives.formBuilder.field.controller', [
      'dados.common.directives.selectLoader',
      'isteven-multi-select'
    ])
    .controller('FieldController', FieldController);

  FieldController.$inject = ['$scope', 'moment'];

  function FieldController($scope, moment) {

    // private variables
    var savedSingleSelect = null;

    // bindable variables
    $scope.opened = false;
    $scope.multiInput = [];
    $scope.multiOutput = [];
    $scope.loadError = false;

    // bindable methods
    $scope.toggleSelectCreate = toggleSelectCreate;
    $scope.clearExpr = clearExpr;
    $scope.validateText = validateText;
    $scope.validateNumber = validateNumber;

    if ($scope.field.field_type == 'singleselect') {
      savedSingleSelect = angular.copy($scope.field.field_value);
      $scope.$watch('field.field_questions', function (oldVal, newVal) {
        if (oldVal !== newVal) {
          _.each($scope.field.field_questions, function (question) {
            if (question.field_value) {
              $scope.field.field_value[question.field_name] = question.field_value;
            }
          });
        }
      }, true);
    }

    // version 0.14.3 of angular-bootstrap doesn't accept strings to ng-model for uib-datepicker
    // so we parse valid dates beforehand: https://github.com/angular-ui/bootstrap/issues/4728
    if ($scope.field.field_type == 'date' && moment($scope.field.field_value).isValid()) {
      $scope.field.field_value = new Date($scope.field.field_value);
    }

    function toggleSelectCreate() {
      if ($scope.selectToggle) {
        savedSingleSelect = angular.copy($scope.field.field_value);
      }
      $scope.field.field_value = ($scope.selectToggle) ?  {} : savedSingleSelect;
    }

    ///////////////////////////////////////////////////////////////////////////

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
