angular.module('dados.common.directives.form-viewer', [
	'ui.bootstrap',
	'ngform-builder',
])

.directive('formViewer', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            fid: '='
        },
        templateUrl: 'directives/form-viewer/form-viewer.tpl.html',
        controller: 'FormViewerController'
    };
})

.controller('FormViewerController', ['$scope', '$modal', 'Form',
	function ($scope, $modal, Form) {

		$scope.form = {};
		Form.get({id: $scope.fid}).$promise.then(function(form) {
			$scope.form = form;
		}, function(errResponse) {
			console.log(errResponse);
		});

		$scope.open = function() {
			var modalInstance = $modal.open({
				template: '<form-directive form="form"></form-directive>',
				controller: ModalInstanceCtrl,
				size: 'lg',
				resolve: {
					form: function () {
						return $scope.form;						
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
		};
	}	
]);

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.
var ModalInstanceCtrl = function ($scope, $modalInstance, form) {
	$scope.form = form;

	$scope.ok = function () {
		$modalInstance.close($scope.form);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
};