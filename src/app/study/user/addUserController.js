(function() {
	'use strict';

	angular
		.module('dados.study.user.addUser.controller', [
			'ui.bootstrap'
		])
		.controller('AddUserController', AddUserController);

	AddUserController.$inject = [
		'$scope', '$modalInstance', '$resource', 'API', 'UserAccess', 'toastr', 'centreHref'
	];

	function AddUserController($scope, $modalInstance, $resource, API, UserAccess, toastr, centreHref) {
		var vm = this;
		// bindable variables
		vm.newUser = {};
		vm.centreHref = centreHref;
		// bindable methods
		vm.addUser = addUser;
		vm.cancel = cancel;

		///////////////////////////////////////////////////////////////////////////

		function addUser() {
      var user = new UserAccess({
        'collectionCentre': vm.newUser.collectionCentre,
        'centreAccess': vm.newUser.centreAccess,
        'user': vm.newUser.user
      });
      user.$update({ id: vm.newUser.user })
      .then(function() {
        toastr.success('Added user to collection centre!', 'Collection Centre');
      }).finally(function () {
        vm.newUser = {};
        $modalInstance.close();
      });
		}

		function cancel() {
		  $modalInstance.dismiss('cancel');
		}

	}
})();
