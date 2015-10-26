/**
 * ScrollPast directive
 *
 * This directive emulates fixed CSS position behaviour without taking element out of flow
 * e.g. as you scroll through the form questions the edit palette stays visible.
 * Doesn't require CSS3 transformations. Function triggers as user scrolls past the element.
 *
 * Implemented using Angular's element and its built-in jqLite library.
 * 
 * Usage:
 * <div scroll-past>Fixed content</div>
 * <div class="scroll-past-anchor">Data container that doesn't fit on the screen</div>
 *
 * @module      directives/pluginEditor/scrollPast
 * @description Directive to emulate fixed element position
 * @help        See https://docs.angularjs.org/api/ng/function/angular.element
 */
 
 (function() {
  'use strict';

  angular
    .module('dados.common.directives.pluginEditor.directives.scrollPast', [
    ])
    .directive('scrollPast', scrollPast);

  scrollPast.$inject = ['$window'];

  function scrollPast($window) {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        angular.element($window).bind("scroll", function() {
          var diff = this.pageYOffset - elem.offset().top;
          var maxDiff = angular.element('.scroll-past-anchor').height() - elem.height();
          
          // Make sure the workspace is larger than palette
          if (diff <= maxDiff) {
            if (diff > 0) {
              elem.css("padding-top", (diff+10) + "px");
            } else {
              elem.css("padding-top", "10px");
            }
          }
          scope.$apply();
        });
      }
    };
  }

})();