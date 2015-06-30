(function() {
  'use strict';

  angular
    .module('dados.common.directives.pluginEditor.layoutController', [
      'dados.common.directives.pluginEditor.widgetModalController'
    ])
    .controller('LayoutController', LayoutController);

  LayoutController.$inject = ['$scope', '$modal'];

  function LayoutController($scope, $modal) {
    $scope.grid = [];  // Plugin layout is defined by a flat grid.
    var MIN_WIDTH = 20; // Minimum width of a cell
    // Cell defaults. Each cell is by default 100% wide.
    $scope.width = 100;
    $scope.step = 10;
    $scope.showSettings = false;
    
    var getTemplate = function() {
      return  { css : { width : $scope.width + '%' } };
    };
    
    /**
     * listener: expand
     *
     * Increases the width of a cell by the defined MIN_WIDTH size;
     * 
     * @param e is the event data
     * @param cell is the cell to expand
     */
    $scope.$on("expand", function(e, cell) {
      var width = parseInt(cell.css.width);
      width += $scope.step;
      if (width > 100) { width = 100; }
      cell.css.width = width + '%';
    });
    
    /**
     * listener: shrink
     *
     * Decreases the width of a cell by the defined MIN_WIDTH size;
     * 
     * @param e is the event data
     * @param cell is the cell to shrink
     */
    $scope.$on("shrink", function(e, cell) {
      var width = parseInt(cell.css.width);
      width -= $scope.step;
      if (width < MIN_WIDTH) { width = MIN_WIDTH; }
      cell.css.width = width + '%';
    });
    
    /**
     * listener: remove
     * 
     * Removes a cell from the grid.
     * 
     * @param e is the event data
     * @param pivotIndex is the index of the cell to be removed
     */
    $scope.$on("remove", function(e, pivotIndex) {
      var cell = $scope.grid[pivotIndex];
      
      
      if (cell.isDeleted === false &&
          confirm("All contents of this will be removed and you will not " +
          "be able to retrieve this. Do you want to continue?")) {
        if (!!(cell.id)) {
          cell.isDeleted = true;
        } else {
          $scope.grid.splice(pivotIndex, 1);
        }
      } else {
        if (cell.isDeleted) {
          cell.isDeleted = false;
        }
      }
    });
    
    /**
     * listener: remove
     * 
     * Adds a cell to the grid.
     * 
     * @param e is the event data
     * @param pivotIndex is the index of the cell to be added.
     */
    $scope.$on("add", function(e, pivotIndex) {
      $scope.grid.splice(pivotIndex, 0, getTemplate());
    });
    
    /**
     * listener: move
     * 
     * Moves a cell from one index to another index
     * 
     * @param e is the event data
     * @param oldIndex is the index of the cell to be moved
     * @param newIndex is the new location of the cell
     */
    $scope.$on("move", function(e, from, to) {
      $scope.grid.splice(to, 0, $scope.grid.splice(from, 1)[0]);
    });
    
    /**
     * listener: configure
     * 
     * Creates a modal window that allows the user to configure a widget to add
     * to the plugin
     * 
     * @param e is the event data
     * @param index is the index of the cell to create the widget
     */
    $scope.$on('configure', function(e, index) {
      var modal = $modal.open({
        templateUrl: 'partials/WidgetModal.html',
        controller: 'WidgetModalController',
        resolve : {
          widget : function() {
            return $scope.grid[index];
          },
          fieldNames: function() {
            var names = [];
            angular.forEach($scope.grid, function(widget) {
              if (angular.isDefined(widget.name)) {
                names.push( widget.name );
              }
            });
            return names;
          }
        }
      });
      
      modal.result.then(function(widget) {
        angular.copy($scope.grid[index].css, widget.css);
        $scope.grid[index] = angular.copy(widget);
      });
    });
    
    $scope.$on('setGrid', function(e, grid) {
      $scope.grid = grid;
      if ($scope.grid.length === 0) {
        $scope.grid.push( getTemplate() );
      }
    });
    
    $scope.$emit('layoutControllerLoaded');
  }

})();