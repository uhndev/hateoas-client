(function() {
	'use strict';

	angular
		.module('dados.study.user.addUser.controller', [
			'ui.bootstrap'
		])
		.controller('AddUserController', AddUserController);

	AddUserController.$inject = [
		'$modalInstance', 'UserEnrollment', 'toastr', 'centreHref'
	];

	function AddUserController($modalInstance, UserEnrollment, toastr, centreHref) {
		var vm = this;
		// bindable variables
		vm.newUser = {};
		vm.centreHref = centreHref;
		// bindable methods
		vm.addUser = addUser;
		vm.cancel = cancel;

		///////////////////////////////////////////////////////////////////////////

		function addUser() {
      var user = new UserEnrollment({
        'collectionCentre': vm.newUser.collectionCentre,
        'centreAccess': vm.newUser.centreAccess,
        'user': vm.newUser.user
      });
      user.$save()
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
