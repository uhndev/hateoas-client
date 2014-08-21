angular.module('dados.common.directives.form-popup.controller', [
	'ngform-builder',
])

.controller('FormPopupController', ['$scope', '$resource', '$modal', 'Form',
	function ($scope, $resource, $modal, Form) {
		var ModalInstanceCtrl = function ($scope, $resource, $modalInstance, url, onSubmit, onCancel) {
			$scope.form = {};
			// retrieve form via href
			var resource = $resource(url);
			resource.get().$promise.then(function (form) {
				$scope.form = form.items;
			}, function(errResponse) {
				$scope.error = 'Unable to load form!';
			});

			// invoke given callbacks for submit
			$scope.ok = function () {
				onSubmit();
				$modalInstance.close($scope.form);
			};

			// invoke given callbacks for cancel
			$scope.cancel = function () {
				onCancel();
				$modalInstance.dismiss('cancel');
			};
		};

		$scope.open = function() {
			var modalInstance = $modal.open({
				templateUrl: 'directives/formPopup/formPopup.tpl.html',
				controller: ModalInstanceCtrl,
				size: 'lg',
				resolve: {
					url: function () {
						return $scope.url;					
					},
					onSubmit: function() {
						return $scope.onSubmit;
					},
					onCancel: function() {
						return $scope.onCancel;
					}
				}
			});

			modalInstance.result.then(function (data) {
				_.each(data.form_questions, function(question) {
					// clean up carousel-added attribute
					angular.copy(_.omit(question, 'active'), question);
				});					
				console.log('SAVE ANSWERSET HERE');
				console.log(angular.copy(data));
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
		};
	}	
]);