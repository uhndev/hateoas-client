(function() {
  'use strict';

  angular
    .module('dados.common.directives.siteMap', [
      'dados.common.directives.siteMap.controller'
    ])
    .directive('siteMap', siteMap);

  DistanceMatrix.$inject = [];

  function DistanceMatrix() {
    return {
      restrict: 'E',
      scope: {
        origins: '=origins',
        destinations: '=destinations',
        originIcon: '=originIcon', // 'assets/img/hospital-building.png'
        destinationIcon: '=destinationIcon' // 'assets/img/hospital-building.png'
      },

      templateUrl: 'directives/siteMap/siteMap.tpl.html',
      controller: 'SiteMapController',
      controllerAs: 'sitemap',
      bindToController: true
    };
  }
})();
