(function() {
	'use strict';	
	angular
		.module('dados.header.controller', ['ui.bootstrap'])
		.controller('HeaderController', HeaderController);

	HeaderController.$inject = [
		'$scope', '$location', '$state', '$rootScope', 'AuthService', 'API'
	];

	function HeaderController($scope, $location, $state, $rootScope, AuthService, API) {
		
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
			if (AuthService.currentUser.group) {
				if (AuthService.tabview !== vm.navigation) {
					vm.navigation = AuthService.tabview;
				}        
			}

			if (AuthService.currentUser) {
				var user = AuthService.currentUser.user;
				vm.currentUser = [user.prefix, user.lastname].join(' ');
			}
		}		

		function updateActive() {
			var href = $location.path();

			_.each(vm.navigation, function(link) {
				var pathArr = _.pathnameToArray(href);
				var comparator = (pathArr.length >= 2) ? '/' + _.first(pathArr) : href;
				if (link.dropdown) {
					_.each(link.dropdown, function(droplink) {
						droplink.isActive = (comparator.toLowerCase() === droplink.href.toLowerCase());
					});
				} else {
					link.isActive = (comparator.toLowerCase() === link.href.toLowerCase());
				}				
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