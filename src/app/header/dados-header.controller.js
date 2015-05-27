(function() {
	'use strict';	
	angular
		.module('dados.header.controller', [])
		.controller('HeaderController', HeaderController);

	HeaderController.$inject = ['$location', '$state', '$rootScope', 'AuthService', 'API', 'TABVIEW'];

	function HeaderController($location, $state, $rootScope, AuthService, API, TABVIEW) {
		
		var vm = this;

		// bindable variables
		vm.isVisible = AuthService.isAuthenticated();
		vm.currentUser = '';
		vm.navigation = [];

		// bindable methods
		vm.logout = logout;
		vm.follow = follow;

		init();

		///////////////////////////////////////////////////////////////////////////
		
		function init() {
			if (AuthService.isAuthenticated()) {
				updateHeader();				
			}
			updateActive();
		}

		function follow(link) {
      if (link) {
        if (link.rel) {
          $location.path(_.convertRestUrl(link.href, API.prefix));
        }
      }
    }

		function updateHeader() {
			if (AuthService.currentRole) {
				var view = AuthService.currentRole.toString().toUpperCase();
				if (TABVIEW[view] !== vm.navigation) {
					vm.navigation = TABVIEW[view];
				}        
			}

			if (AuthService.currentUser) {
				var user = AuthService.currentUser;
				var identity = user.username;
				if (user.prefix && user.lastname) {
					identity = [user.prefix, user.lastname].join(' ');
				}
				vm.currentUser = identity;
			}
		}		

		function updateActive() {
			updateHeader();
			var href = $location.path();

			_.each(vm.navigation, function(link) {
				var pathArr = _.pathnameToArray(href);
				var comparator = (pathArr.length >= 2) ? '/' + _.first(pathArr) : href;
				link.isActive = 
					(comparator.toLowerCase() === link.href.toLowerCase());
			});

			_.each(vm.submenu.links, function(link) {
				var clientUrl = _.convertRestUrl(link.href, API.prefix);
				link.isActive = 
					($location.path().toLowerCase() === clientUrl.toLowerCase());
			});
		}

		function logout() {
			vm.isVisible = false;
			vm.navigation = [];
			AuthService.logout();
		}

		// watchers
		$rootScope.$on('events.unauthorized', function() {
			vm.isVisible = false;
			vm.navigation = [];
		});

		$rootScope.$on('events.authorized', function() {
			vm.isVisible = true;
			updateHeader();
		});

		$rootScope.$on('$locationChangeSuccess', updateActive);
	}

})();