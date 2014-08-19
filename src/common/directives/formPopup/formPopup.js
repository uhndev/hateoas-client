angular.module('dados.common.directives.form-popup', [
	'ui.bootstrap',
	'ngform-builder',
])

.directive('formPopup', function () {
    return {
        restrict: 'E',
        scope: {
            url: '='
        },
        template: '<button class="btn btn-default" ng-click="open()">{{text}}</button>',
        controller: 'FormPopupController',
        link: function (scope, element, attrs) {
	        scope.text = attrs.text || 'Open';
	    }
    };
})

.controller('FormPopupController', ['$scope', '$resource', '$modal', 'Form',
	function ($scope, $resource, $modal, Form) {
		var ModalInstanceCtrl = function ($scope, $resource, $modalInstance, url) {
			$scope.form = {};
			var resource = $resource(url);
			resource.get().$promise.then(function (form) {
				$scope.form = form;
			}, function(errResponse) {
				$scope.error = 'Unable to load form!';
			});

			$scope.ok = function () {
				console.log('ok');
				$modalInstance.close($scope.form);
			};

			$scope.cancel = function () {
				console.log('cancel');
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