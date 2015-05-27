(function(){
	'use strict';

	angular
		.module('dados.common.directives.dadosError.controller', [])
		.controller('ErrorController', ErrorController);

	ErrorController.$inject = ['$modal', '$timeout', '$sailsSocket'];

	function ErrorController($modal, $timeout, $sailsSocket) {
		var vm = this;
		var socketErrorModal = null;
		vm.socketReady = false; // Wait for socket to connect

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
				templateUrl: 'directives/dadosError/dados-error.tpl.html',
				controller: function ErrorModalCtrl($modalInstance, ErrorService) {
					var sm = this;
					sm.error = ErrorService.getInfo();
					sm.error.message = message;

					sm.reconnect = function() {
						$sailsSocket.socket.connect();
					};
					sm.sendError = function() {
						console.log(sm.error);
						// ErrorService.getScreenshot();
					};
				},
				controllerAs: 'err',
				backdrop: 'static',
				keyboard: false
			});
		}

		$sailsSocket.subscribe('connect', function (data) {
			closeSocketErrorModal();
			vm.socketReady = true;
		});

		$sailsSocket.subscribe('disconnect', function (data) {
			$timeout(function() {
				openSocketErrorModal('The application cannot reach the server... Please wait');
				vm.socketReady = false;	
			}, 500);			
		});

		$sailsSocket.subscribe('failure', function (event, data) {
			openSocketErrorModal('The application failed to connect to the server.');
		});		
	}
})();