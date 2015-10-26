/** 
 * 
 */
(function() {
  'use strict';

  angular
    .module('dados.common.directives.pluginEditor.directives.uiSortable', [
    ])
    .directive('uiSortable', uiSortable);

  uiSortable.$inject = [];

  function uiSortable() {
    
    return {
      restrict: 'A',
      link : function(scope, element, attrs) {
        element.sortable()
          .disableSelection()
          .on( "sortstart", function( event, ui ) {
            scope.oldIndex = ui.item.index();
          } )
          .on( "sortupdate", function( event, ui ) {
            scope.$emit('move', scope.oldIndex, ui.item.index());
          });
      }
    };
  }

})();
