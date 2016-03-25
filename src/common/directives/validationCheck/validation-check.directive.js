/**
 * @name validation-check
 * @description Simple directive that when given a criteria object of validation rules,
 *              will verify from backend if input is valid.
 * @example <input ng-model="passwordValue" validation-check criteria="{model: 'user', attribute: 'username'}}"/>
 */

(function() {
  'use strict';

  angular
    .module('dados.common.directives.validationCheck', [])
    .directive('validationCheck', validationCheck);

  validationCheck.$inject = ['$log', 'API', 'ResourceFactory'];

  function validationCheck($log, API, ResourceFactory) {
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
          var Resource = ResourceFactory.create(API.url(criteria.model));

          Resource.query(query).$promise
            .then(function (results) {
              ngModel.$setValidity('unique', (results.length === 0));
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
