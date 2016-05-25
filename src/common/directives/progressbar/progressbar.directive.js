(function() {
  'use strict';
  angular.module('dados.common.directives.progressbar', [])
    .directive('uibProgressbar', uibProgressbar);

  uibProgressbar.$inject = [];

  function uibProgressbar() {
    return {
      restrict: 'E',
      link: function (scope, element) {

        scope.value = 0;

        var indicatorOrder = 0;

        var indicators = [];

        function calculateTotal(sum) {

          indicators = [];

          var i = 0;

          while (i <= sum) {
            if (i !== 0) {
              indicators.push((Math.round((i / sum) * 100)));

            }
            i++;
          }
        }

        /**
         * IndicatorSize
         * @description  Event that fires from a given controller the Indicators sum.
         */
        scope.$on('IndicatorsSum', function(event, size) {
          calculateTotal(size);

        });

        /**
         * NextIndicator
         * @description Event that fires from a given controller
         *              when an indicator is completed.
         */
        scope.$on('NextIndicator', function() {
          if (indicatorOrder < indicators.length - 1) {
            scope.value = indicators[indicatorOrder];
            indicatorOrder++;

          }else {
            scope.value = 100;

          }
        });

        /**
         * PrevIndicator
         * @description Event that fires from a given controller
         *              when an indicator is started.
         */
        scope.$on('PrevIndicator', function() {
          if (indicatorOrder !== 0 < 0 && indicatorOrder !== 0) {
            indicatorOrder--;
            scope.value = indicators[indicatorOrder];

          }else {
            scope.value = 0;

          }
        });
      }
    };
  }
})();
