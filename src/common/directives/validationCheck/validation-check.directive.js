/**
 * @name validation-check
 * @description Simple directive that when given a criteria object of validation rules,
 *              will verify from backend if input is valid.
 * @example <input ng-model="passwordValue" validation-check criteria="{model: 'user', id: 1, attribute: 'username'}"/>
 */

(function() {
  'use strict';

  angular
    .module('dados.common.directives.validationCheck', [])
    .directive('validationCheck', validationCheck);

  validationCheck.$inject = ['$log', 'modelValidator'];

  function validationCheck($log, modelValidator) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attributes, ngModel) {
        element.bind('blur', function (event) {
          var criteria = scope.$eval(attributes.criteria);
          if (!ngModel || !element.val() || !criteria.model || !criteria.attribute) {
            return;
          }

          var currentValue = element.val();
          var query = {where: {}};
          query.where[criteria.attribute] = currentValue;

          // ensure match on non-self reference
          if (criteria.id) {
            query.where.id = {'!': criteria.id};
          }

          modelValidator.isUnique(criteria.model, query)
            .then(function (result) {
              if (currentValue == element.val()) {
                ngModel.$setValidity('unique', result);
              }
            })
            .catch(function (error) {
              $log.error(error);
              ngModel.$setValidity('unique', false);
            });
        });
      }
    };
  }

})();
