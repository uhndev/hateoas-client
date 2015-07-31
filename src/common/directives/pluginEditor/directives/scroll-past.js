 
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