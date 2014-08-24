angular.module('dados.error', [
	'ngSails',
	'dados.common.services.error'
])

.controller( 'ErrorCtrl', function ErrorCtrl ( $scope, $modal, $timeout, Authentication, $sails ) {

	var socketErrorModal = null;

	function closeSocketErrorModal() {
		if (socketErrorModal) {
			socketErrorModal.dismiss();
			socketErrorModal = null;
		}
	}

	function openSocketErrorModal(message) {
		closeSocketErrorModal();
		socketErrorModal = $modal.open({
			size: 'lg',
			templateUrl: 'error/error.tpl.html',
			controller: function ErrorModalCtrl($scope, $modalInstance, ErrorService) {
				$scope.error = ErrorService.getInfo();
				$scope.error.message = message;

				$scope.reconnect = function() {
					$sails.socket.connect();
				};
				$scope.sendError = function() {
					console.log($scope.error);
					// ErrorService.getScreenshot();
				};
			},
			backdrop: 'static',
			keyboard: false
		});
	}

	$scope.socketReady = false; // Wait for socket to connect

	$sails.on('connect', function (event, data) {
		closeSocketErrorModal();
		$scope.socketReady = true;
	});

	$sails.on('disconnect', function (event, data) {
		$timeout(function() {
			openSocketErrorModal('The application cannot reach the server... Please wait');
			$scope.socketReady = false;	
		}, 500);			
	});

	$sails.on('failure', function (event, data) {
		openSocketErrorModal('The application failed to connect to the server.');
	});	
});