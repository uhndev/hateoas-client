(function() {
  'use strict';

  angular
    .module('dados.common.directives.distanceMatrix', [
      'dados.common.directives.distanceMatrix.controller'
    ])
    .directive('distanceMatrix', DistanceMatrix);

  DistanceMatrix.$inject = [];

  function DistanceMatrix() {
    return {
      restrict: 'E',
      scope: {
        origins: '=',
        sites: '=',
        selectedSite: '='
      },

      templateUrl: 'directives/distanceMatrix/distanceMatrix.tpl.html',
      controller: 'DistanceMatrixController',
      controllerAs: 'distance',
      bindToController: true
    };
  }
})();
