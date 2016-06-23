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
        selectAll: '=',
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
        //creates the add all button only if the select all option is set to true
        if (scope.select.selectAll) {
          var selectContainer = element.parents('.form-group').children('div').first();
          var selectButton = angular.element ('<button id="selectAll" class="btn btn-default"> Select All </button>');
          scope.select.allValues = function() {
            scope.select.values = scope.select.allChoices;
            scope.$apply();
          };
          selectContainer.before(selectButton);
          selectButton.bind('click', scope.select.allValues);
        }
      }
    };
  }
})();
