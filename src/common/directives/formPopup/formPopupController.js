angular.module('dados.common.directives.form-popup.controller', [
	'ngform-builder',
])

.controller('FormPopupController', ['$scope', '$resource', '$modal',
	function ($scope, $resource, $modal) {

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
				var answerSet = {
					study_id: "1", 
					subject_id: "2", 
					formState: {},
					expiresAt: new Date()
				};
				_.each(data.form_questions, function(question) {
					// extract question without metadata
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