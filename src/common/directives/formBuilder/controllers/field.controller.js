(function() {
  'use strict';

  angular
    .module('dados.common.directives.formBuilder.field.controller', [
      'dados.common.directives.selectLoader',
      'ui.select'
    ])
    .controller('FieldController', FieldController);

  FieldController.$inject = ['$scope', 'TemplateService', 'AltumAPIService'];

  function FieldController($scope, TemplateService, AltumAPI) {

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
    $scope.validateRule = validateRule;
    $scope.validateText = validateText;
    $scope.validateNumber = validateNumber;

    switch ($scope.field.field_type) {
      case 'subform':
      case 'singleselect':
        var modelTemplate;
        // if given model name and field value is number, create subform
        if ($scope.field.field_userURL && $scope.field.field_type === 'subform') {
          TemplateService
            .fetchTemplate($scope.field.field_userURL)
            .then(function (fetchedTemplate) { // fetch model data from model id
              modelTemplate = fetchedTemplate;
              if (_.isNumber($scope.field.field_value)) {
                return AltumAPI[_.capitalizeFirst($scope.field.field_userURL)].get({
                  id: $scope.field.field_value
                }).$promise;
              } else {
                return $scope.field.field_value;
              }
            })
            .then(function (modelData) { // create subform and apply data to form
              var modelForm = TemplateService.parseToForm(modelData, modelTemplate);
              $scope.field.field_questions = angular.copy(modelForm.form_questions);
              if (modelData) {
                $scope.field.field_value = angular.copy(modelData);
                _.each($scope.field.field_questions, function (question) {
                  question.field_value = modelData[question.field_name];
                });
              }
            });
        }

        $scope.field.field_baseQuery = $scope.field.field_baseQuery || {};
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
        break;
      case 'multiselect':
        $scope.field.field_baseQuery = $scope.field.field_baseQuery || {};
        break;
      case 'date':
        // version 0.14.3 of angular-bootstrap doesn't accept strings to ng-model for uib-datepicker
        // so we parse valid dates beforehand: https://github.com/angular-ui/bootstrap/issues/4728
        switch (true) {
          case !moment($scope.field.field_value).isValid():
            delete $scope.field.field_value;
            break;
          case angular.isString($scope.field.field_value):
            $scope.field.field_value = new Date($scope.field.field_value);
            break;
          default:
            $scope.field.field_value = new Date();
            break;
        }
        break;
      default: break;
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

    function validateRule(field) {
      if (field.field_required) {
        return true;
      } else {
        var parentForm = $scope[field.field_name + 'Form'].$$parentForm;
        if (_.has(field, 'field_rules')) {

          switch (true) {
            case _.has(field.field_rules, 'requiredWhen') && _.has(field.field_rules.requiredWhen, 'missing'):
              return _.any(field.field_rules.requiredWhen.missing, function (fieldName) {
                var modelValue = parentForm[fieldName + 'Form'][fieldName].$modelValue;
                return _.isNull(modelValue) && _.isUndefined(modelValue);
              }) && field.field_value;
            case _.has(field.field_rules, 'requiredWhen') && _.has(field.field_rules.requiredWhen, 'given'):
              return;
            default: return;
          }
        }
      }
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
