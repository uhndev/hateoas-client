/**
 * @name site-map
 * @description takes a set of AngularGoogleMaps Markers, a json 'map' object containing the params
 * passed to the map, mapReady to allow the calling controller to show/hide the map
 *
 * The details of what's needed from the markers object is available in the angualr-google-maps
 * docs presently at
 *
 * http://angular-ui.github.io/angular-google-maps/#!/api/markers
 *
 *
 * @example
 *
 * <site-map map-ready="assessment.mapReady" map="assessment.map" selected-site="assessment.selectedSite" markers="assessment.markers" selected-client-marker="assessment.selectedClientMarker"></site-map>
 *
 * @param mapReady boolean
 * @param map {control: {}, center: {latitude: 43.7000, longitude: -79.4000}, zoom: 7}
 * @param selectedSite JSON arm site object
 * @param markers json site markers
 * @param selectedClientMarker json marker for client
 *
 */
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
        selectedSite: '=',
        selectedClientMarker: '=',
        markers: '=',
        map: '=',
        mapReady: '='
      },

      templateUrl: 'directives/siteMap/siteMap.tpl.html',
      controller: 'SiteMapController',
      controllerAs: 'sitemap',
      bindToController: true
    };
  }
})();
