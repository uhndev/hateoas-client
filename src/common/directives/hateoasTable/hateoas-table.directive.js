/**
 * hateoas-table
 */
(function() {
  'use strict';

  angular
    .module('dados.common.directives.hateoasTable', [
      'dados.common.directives.hateoasTable.controller'
    ])
    .directive('hateoasTable', hateoasTable);

  function hateoasTable() {
    return {
      restrict: 'E',
      scope: {
        url: '@',
        query: '=',
        selected: '=',
        filter: '=',
        allow: '=',
        template: '=',
        resource: '=',
        onResourceLoaded: '='
      },
      templateUrl: 'directives/hateoasTable/hateoas-table.tpl.html',
      controller: 'HateoasTableController',
      controllerAs: 'ht',
      bindToController: true
    };
  }

})();
