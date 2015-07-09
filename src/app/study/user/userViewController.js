(function() {
	'use strict';
	angular
		.module('dados.study.user', [
			'dados.user.service',
			'dados.study.user.addUser.controller',
			'dados.collectioncentre.service',
			'dados.common.directives.selectLoader'
		])
		.controller('StudyUserController', StudyUserController);

	StudyUserController.$inject = [
		'$scope', '$q', '$resource', '$location', '$modal', 'AuthService', 'ngTableParams',
		'sailsNgTable', 'CollectionCentreService', 'UserAccess', 'UserEnrollment', 'toastr', 'API'
	];

	function StudyUserController($scope, $q, $resource, $location, $modal, AuthService, TableParams,
																SailsNgTable, CollectionCentre, UserAccess, UserEnrollment, toastr, API) {

		var vm = this;
		var savedAccess = {};

		// bindable variables
		vm.allow = '';
		vm.centreHref = '';
		vm.query = { 'where' : {} };
		vm.toggleEdit = true;
		vm.selected = null;
		vm.filters = {};
		vm.template = {};
		vm.resource = {};
		vm.url = API.url() + $location.path();

		// bindable methods
		vm.select = select;
		vm.openUser = openUser;
		vm.openAddUser = openAddUser;
		vm.saveChanges = saveChanges;
    vm.archiveUser = archiveUser;

		init();

		///////////////////////////////////////////////////////////////////////////

		function init() {
			var currStudy = _.getStudyFromUrl($location.path());

			var Resource = $resource(vm.url);
			var TABLE_SETTINGS = {
				page: 1,
				count: 10,
				filter: vm.filters
			};

			$scope.tableParams = new TableParams(TABLE_SETTINGS, {
				counts: [],
				getData: function($defer, params) {
					var api = SailsNgTable.parse(params, vm.query);

					Resource.get(api, function(data, headers) {
						vm.selected = null;
						vm.allow = headers('allow');
						vm.centreHref = "study/" + currStudy + "/collectioncentre";

						// add role and collection centre fields
						data.template.data = data.template.data.concat([
							{
								"name": "collectionCentre",
								"type": "singleselect",
								"prompt": "Collection Centre",
								"value": vm.centreHref
							},
							{
								"name": "centreAccess",
								"type": "dropdown",
								"prompt": "Role",
								"value": "role"
							}
						]);

						vm.template = data.template;
						vm.resource = angular.copy(data);

						_.each(data.items, function (item) {
							savedAccess[item.enrollmentId] = {};
							savedAccess[item.enrollmentId].centreAccess = item.centreAccess;
							savedAccess[item.enrollmentId].collectionCentre = item.collectionCentre;
						});

						params.total(data.total);
						$defer.resolve(data.items);

						// initialize submenu
						if (currStudy && _.has(data, 'links') && data.links.length > 0) {
							// from workflowstate and current url study
							// replace wildcards in href with study name
							_.map(data.links, function(link) {
								if (link.rel === 'overview' && link.prompt === '*') {
									 link.prompt = currStudy;
								}
								if (_.contains(link.href, '*')) {
									link.href = link.href.replace(/\*/g, currStudy);
								}
								return link;
							});
							var submenu = {
								links: AuthService.getRoleLinks(data.links)
							};
							angular.copy(submenu, $scope.dados.submenu);
						}
					});
				}
			});
		}

		function select(item) {
			vm.selected = (vm.selected === item ? null : item);
		}

		function openUser() {
      if (vm.selected.rel) {
        $location.path(_.convertRestUrl(vm.selected.href, API.prefix));
      }
		}

		function openAddUser() {
	    var modalInstance = $modal.open({
	      animation: true,
	      templateUrl: 'study/user/addUserModal.tpl.html',
	      controller: 'AddUserController',
	      controllerAs: 'addUser',
	      bindToController: true,
	      size: 'lg',
	      resolve: {
	        centreHref: function () {
	          return vm.centreHref;
	        }
	      }
	    });

	    modalInstance.result.then(function () {
	      $scope.tableParams.reload();
	    });
		}

		function saveChanges() {
			$q.all(_.map(vm.resource.items, function (item) {
				// only make PUT request if necessary if selection changed
				if (!_.isEqual(savedAccess[item.enrollmentId].centreAccess, item.centreAccess) ||
            !_.isEqual(savedAccess[item.enrollmentId].collectionCentre, item.collectionCentre)) {
					var enrollment = new UserEnrollment({
            user: item.id,
            collectionCentre: item.collectionCentre,
            centreAccess: item.centreAccess
          });
					return enrollment.$update({ id: item.enrollmentId });
				}
				return;
			}))
			.then(function() {
				toastr.success('Updated collection centre permissions successfully!', 'Collection Centre');
        $scope.tableParams.reload();
			});
		}

    function archiveUser() {
      var enrollment = new UserEnrollment({
        expiredAt: new Date()
      });
      return enrollment.$update({ id: vm.selected.enrollmentId }).then(function () {
        toastr.success('Archived user enrollment!', 'Enrollment');
        $scope.tableParams.reload();
      });
    }

		// watchers
		$scope.$watchCollection('studyUser.query.where', function(newQuery, oldQuery) {
			if (newQuery && !_.isEqual(newQuery, oldQuery)) {
				// Page changes will trigger a reload. To reduce the calls to
				// the server, force a reload only when the user is already on
				// page 1.
				if ($scope.tableParams.page() !== 1) {
					$scope.tableParams.page(1);
				} else {
					$scope.tableParams.reload();
				}
			}
		});

		$scope.$on('hateoas.client.refresh', function() {
			init();
		});
	}
})();
