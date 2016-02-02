(function() {
  'use strict';

  angular
    .module('dados.common.directives.siteMap', [
      'dados.common.directives.siteMap.controller'
    ])
    .directive('siteMap', SiteMap);

  SiteMap.$inject = [];

  function SiteMap() {
    return {
      restrict: 'E',
      scope: {
        site: '=selectedSite',
        markers: '@',
        map: '@',
        originIcon: '@',      // 'assets/img/hospital-building.png'
        destinationIcon: '@', // 'assets/img/hospital-building.png'
        destinationClick: '@' // onclick method for destination
      },

      templateUrl: 'directives/siteMap/siteMap.tpl.html',
      controller: 'SiteMapController',
      controllerAs: 'sitemap',
      bindToController: true
    };
  }
})();
