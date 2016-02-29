/**
 * @name focus-if
 * @description Directive that sets focus based on some given expression
 */
(function() {
  'use strict';
  angular
    .module('dados.common.directives.focusIf', [])
    .directive('focusIf', focusIf);

  focusIf.$inject = [];

  function focusIf() {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) {
        scope.$watch(function() {
          return scope.$eval(attributes.focusIf);
        },function (newValue) {
          if (newValue === true) {
            element[0].focus();
          }
        });
      }
    };
  }

})();
