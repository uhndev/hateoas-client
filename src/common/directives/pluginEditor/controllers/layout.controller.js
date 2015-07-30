(function() {
  'use strict';

  angular
    .module('dados.common.directives.pluginEditor.layoutController', [
      'dados.common.directives.pluginEditor.widgetController',
      'dados.common.directives.pluginEditor.widgetService'
    ])
    .controller('LayoutController', LayoutController);

  LayoutController.$inject = ['$scope', '$modal', 'WidgetService'];

  function LayoutController($scope, $modal, WidgetService) {
    $scope.questions = [];
    $scope.selectedIndex = -1;
    $scope.editTabActive = [true,false,false,false,false,false,false];
	
    var MIN_WIDTH = 20; // Minimum width of a cell
    // Cell defaults. Each cell is by default 100% wide.
    $scope.width = 100;
    $scope.step = 10;
    $scope.showSettings = false;
    
    var getTemplate = function() {
      return  { css : { width : $scope.width + '%' } };
    };
		
    var selectWidget = function(idx) {
      $scope.selectedIndex = idx;
      if($scope.questions[idx].template) {
        $scope.editTabActive[2] = true;
      } else {
        $scope.editTabActive[1] = true;
      }
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
      var cell = $scope.questions[pivotIndex];
      
      if (cell.isDeleted === false &&
          confirm("All contents of this will be removed and you will not " +
          "be able to retrieve this. Do you want to continue?")) {
        if (!!(cell.id)) {
          cell.isDeleted = true;
        } else {
          $scope.questions.splice(pivotIndex, 1);
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
      $scope.questions.splice(pivotIndex, 0, getTemplate());
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
      $scope.questions.splice(to, 0, $scope.questions.splice(from, 1)[0]);
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
      selectWidget(index);
    });
	
    $scope.addNewWidget = function(template) {
      var prevLen = $scope.questions.length;
      var newLen = $scope.questions.push(_.extend(WidgetService.templates[template], getTemplate()));
      if(newLen > prevLen) {
        selectWidget(prevLen);
      }
    };
	
    $scope.$on('updateWidget', function(e, widget) {
      if (widget.css) {
        $scope.questions[$scope.selectedIndex] = angular.copy(widget);
      }
    });
    
    $scope.$on('setGrid', function(e, grid) {
      $scope.questions = grid;
      if ($scope.questions.length === 0) {
        $scope.questions.push( getTemplate() );
        $scope.selectedIndex = 0;
      }
    });
    
    $scope.$emit('layoutControllerLoaded');
  }

})();