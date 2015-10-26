/******************************************************************************
 * attr: ng-name
 * 
 * In 1.2.13 of Angular, Angular cannot bind to the name attribute. This directive
 * will set the name of a DOM element given an Angular expression in the ng-name
 * attribute. 
 ******************************************************************************/
 
 (function() {
  'use strict';

  angular
    .module('dados.common.directives.pluginEditor.directives.ngName', [
    ])
    .directive('ngName', ngName);

  ngName.$inject = ['$compile'];

  function ngName($compile) {
    
    return {
      restrict: 'A',
      link: {
        pre: function(scope, elem) {
            var name = scope.$eval(elem.attr('ng-name'));
            elem.removeAttr('ng-name');
            elem.attr('name', name);
            $compile(elem)(scope);
        }
      }
    };
  }

})();