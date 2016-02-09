/**
 * @name distance-matrix
 * @description takes an array of sites and an origin address and prints a google
 * distanceMatrix table. Site names are clickable to set the two way bound selectedSite
 *
 * @example
 *
 *
 * <distance-matrix selected-site="assessment.selectedSite" origin="assessment.myorigin" sites="assessment.sites"  />
 *
 * @param array of JSON site objects
 * @param origin "1-173 Quebec Ave 1 ON M6P2T9 Canada"
 * @param selectedSite json object containing the currently selected site
 *
 */
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
        origin: '=',
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
