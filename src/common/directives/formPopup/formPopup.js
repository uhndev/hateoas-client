angular.module('dados.common.directives.form-popup', [
	'ui.bootstrap',
	'ngform-builder',
])

.directive('formPopup', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            fid: '='
        },
        template: '<button class="btn btn-default" ng-click="open()">Open Form Modal</button>',
        controller: 'FormPopupController'
    };
})

.controller('FormPopupController', ['$scope', '$modal', 'Form',
	function ($scope, $modal, Form) {
		// Please note that $modalInstance represents a modal window (instance) dependency.
		// It is not the same as the $modal service used above.
		var ModalInstanceCtrl = function ($scope, $modalInstance, form) {
			$scope.form = form;

			$scope.ok = function () {
				console.log('ok');
				$modalInstance.close($scope.form);
			};

			$scope.cancel = function () {
				console.log('cancel');
				$modalInstance.dismiss('cancel');
			};
		};
		
		$scope.form = {};
		Form.get({id: $scope.fid}).$promise.then(function(form) {
			$scope.form = form;
		}, function(errResponse) {
			console.log(errResponse);
		});

		$scope.open = function() {
			var modalInstance = $modal.open({
				templateUrl: 'directives/formPopup/formPopup.tpl.html',
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