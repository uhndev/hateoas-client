(function () {
  'use strict';

  angular
    .module('dados.common.directives.selectLoader', [
      'dados.common.directives.selectLoader.controller'
    ])
    .directive('selectLoader', selectLoader);

  selectLoader.$inject = [];

  function selectLoader() {
    return {
      restrict: 'E',
      require: 'ngModel',
      scope: {
        url: '@',
        query: '=',
        isAtomic: '=',
        isDisabled: '=',
        bindObject: '@?',
        values: '=ngModel',
        placeholder: '@?',
        labels: '@',
        expiresIn: '@?'
      },
      templateUrl: 'directives/selectLoader/select-loader.tpl.html',
      controller: 'SelectController',
      controllerAs: 'select',
      bindToController: true,
      link: function(scope, element, attributes, ngModel) {
        // from model -> view, called when the view needs to be updated
        ngModel.$render = function() {
          if (attributes.ngChange) {
            scope.$parent.$eval(attributes.ngChange);
          }
        };
      }
    };
  }
})();
