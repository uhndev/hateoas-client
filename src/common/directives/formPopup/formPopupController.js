angular.module('dados.common.directives.form-popup.controller', [
	'ngform-builder',
])

.controller('FormPopupController', ['$scope', '$resource', '$modal',
	function ($scope, $resource, $modal) {

		var ModalInstanceCtrl = function ($scope, $resource, $modalInstance, template, onSubmit, onCancel) {
			$scope.form = {};
			// (Create, Update) callback payloads
			var payload = onSubmit();
			var item = payload.item;

			// retrieve form via href
			var form = $resource(template.href);
			form.get().$promise.then(function (form) {
				$scope.form = form.items;
				// if item was included in callback payload, map item values to form
				if (item) {
					// retrieve values from selected row via template data name
					var values = _.map(template.data, function(temp) { return item[temp.name]; });
					// replace field values in form
					_.each(form.items.form_questions, function(question, idx) {
						question.field_value = values[idx];
					});
					$scope.form = form.items;
				}
			}, function(errResponse) {
				$scope.error = 'Unable to load form!';
			});

			// invoke given callbacks for submit
			$scope.ok = function () {
				$modalInstance.result.then(function (data) {
					var answers = _.zipObject(
													_.pluck(template.data, 'name'),
													_.pluck(data.form_questions, 'field_value')
												);
					var resource = new payload.Resource(answers);
					
					// if we want to update
					if (item) {
						resource.$update().then(function (data) {
							console.log('updated');
						}).catch(function (err) {
							console.log(err);
						});
					} 
					// otherwise, we create a new form
					else {
						resource.$save().then(function (data) {
							console.log('saved');
						}).catch(function (err) {
							console.log(err);
						});
					} 
				}, function () {
					console.log('Modal dismissed at: ' + new Date());
				});
				$modalInstance.close($scope.form);
			};

			// invoke given callbacks for cancel
			$scope.cancel = function () {
				onCancel();
				$modalInstance.dismiss('cancel');
			};
		};

		$scope.open = function() {

			// if not given a form URL, pass through and continue without popup
			if (!$scope.template.href) {
				return $scope.onSubmit();
			}

			// otherwise, we know the form to load, and we open a modal
			var modalInstance = $modal.open({
				templateUrl: 'directives/formPopup/formPopup.tpl.html',
				controller: ModalInstanceCtrl,
				size: 'lg',
				resolve: {
					template: function () {
						return $scope.template;
					},
					onSubmit: function() {
						return $scope.onSubmit;
					},
					onCancel: function() {
						return $scope.onCancel;
					}
				}
			});
		};
	}	
]);