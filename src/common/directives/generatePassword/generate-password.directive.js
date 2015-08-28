/**
 * @name generate-password
 * @description Simple directive that wraps an input tag with button to generate
 *              a randomized password to be bound to the input field's ng-model.
 * @example <input ng-model="passwordValue"
 *                 generate-password for-input="passwordValue" />
 */

(function() {
  'use strict';

  angular
    .module('dados.common.directives.generatePassword', [])
    .directive('generatePassword', generatePassword);

  generatePassword.$inject = [];

  function generatePassword() {
    return {
      restrict: 'A',
      scope: {
        forInput: '='
      },
      replace: true,
      link: function(scope, elem) {
        var button = angular.element('<span class="input-group-btn">'+
          '<button type="button" class="btn btn-info">Generate</button>'+
        '</span>');
        elem.wrap('<p class="input-group"></p>');
        elem.after(button);

        scope.generate = function() {
          scope.forInput = Math.random().toString(36).slice(-8);
          scope.$apply();
        };
        button.bind('click', scope.generate);
      }
    };
  }

})();
