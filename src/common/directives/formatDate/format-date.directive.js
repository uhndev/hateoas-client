/**
 * @name format-date
 * @description Used for bound input date fields whose ng-model may not necessarily be a date object.
 * @example
 *    <input type="date" ng-model="possibleDate" format-date/>
 *
 */
(function () {
  'use strict';

  angular
    .module('dados.common.directives.formatDate', [])
    .directive('formatDate', formatDate);

  formatDate.$inject = [];

  function formatDate() {
    return {
      require: 'ngModel',
      link: function(scope, elem, attr, modelCtrl) {
        modelCtrl.$formatters.push(function(modelValue) {
          if (modelValue) {
            return new Date(modelValue);
          }
          else {
            return null;
          }
        });
      }
    };
  }

})();

