/******************************************************************************
 * # Editor Directives #
 * 
 * This file contains common directives used by the Plugin Framework. Currently,
 * supported are:
 * 
 * - ng-image-drop Attribute
 ******************************************************************************/
angular.module('ui.dados.editors.plugin', [
  'ui.dados.editors.ngImageDrop',
  'ui.dados.editors.uiGrid'
]);


/******************************************************************************
 * ## ng-image-drop Attribute ##
 * 
 * Defines the ng-image-drop attribute. This attribute will allow any element to
 * accept a file through a drag-n-drop facility. When a file is dropped on an
 * ng-image-drop element, the file will be converted to a data-uri and the
 * event imageLoaded will be fired.
 * 
 * @attr ngModel - the bound model
 * @fires imageLoaded - an event that notifies listeners that a file has been loaded
 ******************************************************************************/
angular.module('ui.dados.editors.ngImageDrop', [])
  .directive('ngImageDrop', function () {
	  
    var stopBubble = function(e) {
		if (e.stopPropagation) {
      e.stopPropagation();
    }
	  if (e.preventDefault) {
      e.preventDefault();
    }
	  e.cancelBubble = true;
	  e.returnValue = false;
	};

    var onDrop = function (e, scope, ctrl) {
    	stopBubble(e);
        e = e.originalEvent;
        var files = e.dataTransfer.files;
        
        var reader = new FileReader();

        reader.onload = function (e) {
            var dataURL = reader.result;
            ctrl.$setViewValue(dataURL);
            ctrl.$render();
            scope.$apply();
            scope.$emit('imageLoaded', scope.image);
        };

        reader.readAsDataURL(files[0]);
    };

    return {
        restrict: 'A',
        require: "^ngModel",
        link: function (scope, element, attrs, ctrl) {
            element.bind("drop", function(e) {
            	onDrop(e, scope, ctrl);
            })
                .bind("dragover", stopBubble)
                .bind("dragenter", stopBubble)
                .bind("dragleave", stopBubble);
        }
    };
});

angular.module('ui.dados.editors.uiGrid', [])
  .directive('uiGrid',  function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			cellIndex: '=',
			cellCount: '=',
			cell: '='
		},
		templateUrl: 'partials/UiGrid.html',
		controller: function($scope, $element) {
			
			$scope.configure = function() {
				$scope.$emit('configure', $scope.cellIndex);
			};
			
			$scope.remove = function() {
				$scope.$emit('remove', $scope.cellIndex);
			};

			$scope.shrinkable = function() {
				return (parseInt($scope.cell.css.width) > 20);
			};
			
			$scope.shrink = function() {
				$scope.$emit('shrink', $scope.cell);
			};
			
			$scope.expandable = function() {
				return (parseInt($scope.cell.css.width) < 100);
			};
			
			$scope.expand = function() {
				$scope.$emit('expand', $scope.cell);
			};
			
			$scope.addLeft = function() {
				$scope.$emit('add', $scope.cellIndex);
			};
			
			$scope.addRight = function() {
				$scope.$emit('add', $scope.cellIndex + 1);
			};
		}
	};
});