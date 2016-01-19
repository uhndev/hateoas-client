(function () {
  'use strict';

  angular
    .module('dados.common.directives.selectLoader', [
      'dados.common.directives.selectLoader.controller'
    ])
    .directive('selectLoader', selectLoader);

  selectLoader.$inject = ['$timeout'];

  function selectLoader($timeout) {
    return {
      restrict: 'E',
      require: 'ngModel',
      scope: {
        url: '@',
        query: '=',
        isAtomic: '=',
        isDisabled: '=',
        values: '=ngModel',
        labels: '@'
      },
      templateUrl: 'directives/selectLoader/select-loader.tpl.html',
      controller: 'SelectController',
      controllerAs: 'select',
      bindToController: true,
      link: function(scope, element, attributes, ngModel) {
        // from model -> view
        ngModel.$render = function() {
          scope.values = ngModel.$viewValue;
          if (attributes.ngChange) {
            scope.$parent.$eval(attributes.ngChange);
          }
        };
      }
    };
  }
})();
