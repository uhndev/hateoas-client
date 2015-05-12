var uiGrid = function() {
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
};