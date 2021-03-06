/**
 * @name hateoas-table
 * @description hateoasTable is a helper directive designed to help minimize boilerplate table code that
 *              is required to render a hateoas response.  As part of its operation, it requires several
 *              variables that are passed in from a parent scope to the isolate scope.
 *              It is important to note that the actual call to the server exists within this directive's
 *              controller, and we allow a function to intercept and 'masssage' the data as needed before
 *              being rendered to the table.
 * @example
 *
 * In your model.tpl.html:
 *   <hateoas-table
       url="{{model.url}}"
       query="model.query"
       selected="model.selected"
       allow="model.allow"
       resource="model.resource"
       on-resource-loaded="model.onResourceLoaded">
     </hateoas-table>

 * In your model.controller.js, the variables listed above *must* be defined in order for them to be bound
 * back from the child scope in this directive.  You will also need to define an intermediary function in
 * your parent controller:
 *
 * function onResourceLoaded(data) {
 *   // do something to the data returned from server before being rendered to table
 *   return data;
 * }
 *
 */
(function() {
  'use strict';

  angular
    .module('dados.common.directives.hateoasTable', [
      'dados.common.directives.hateoasTable.controller'
    ])
    .component('hateoasTable', {
      bindings: {
        url: '@',
        query: '=',
        selected: '=',
        allow: '=',
        resource: '=',
        onSelect: '=?',
        onResourceLoaded: '=?'
      },
      templateUrl: 'directives/hateoasTable/hateoas-table.tpl.html',
      controller: 'HateoasTableController',
      controllerAs: 'ht'
    });

})();
