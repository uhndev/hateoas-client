(function () {
  'use strict';
  angular
    .module('dados.study.user', [
      'dados.user.service',
      'dados.study.user.addUser.controller',
      'dados.collectioncentre.service'
    ])
    .controller('StudyUserController', StudyUserController);

  StudyUserController.$inject = [
    '$scope', '$q', '$location', '$uibModal', 'HeaderService', 'UserEnrollment', 'toastr', 'API'
  ];

  function StudyUserController($scope, $q, $location, $uibModal, HeaderService, UserEnrollment, toastr, API) {

    var vm = this;
    var savedAccess = {};

    // private variables
    var studyID = _.getParentIDFromUrl($location.path());
    var centreHref = 'study/' + studyID + '/collectioncentres';

    // bindable variables
    vm.allow = {};
    vm.query = {'where': {}};
    vm.toggleEdit = true;
    vm.selected = null;
    vm.filters = {};
    vm.template = {};
    vm.resource = {};
    vm.url = API.url() + $location.path();

    // bindable methods
    vm.openUser = openUser;
    vm.openAddUser = openAddUser;
    vm.saveChanges = saveChanges;
    vm.archiveUser = archiveUser;
    vm.onResourceLoaded = onResourceLoaded;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * onResourceLoaded
     * @description See hateoas-table directive for more details but in a nutshell, this function
     *              exists to intercept and 'massage' the data as needed before being rendered to the table.
     * @param data hateoas response fetched from resource endpoint
     * @returns {*}
     */
    function onResourceLoaded(data) {
      if (data) {
        // depending on permissions, render select-loader or plaintext
        var columnName = (vm.allow.update || vm.allow.create) ? 'collectionCentre' : 'collectionCentreName';
        // add role and collection centre fields
        data.template.data = data.template.data.concat([
          {
            'name': columnName,
            'type': 'collectioncentre',
            'prompt': 'COMMON.MODELS.USER_ENROLLMENT.COLLECTION_CENTRE',
            'value': centreHref
          },
          {
            'name': 'centreAccess',
            'type': 'string',
            'prompt': 'COMMON.MODELS.USER_ENROLLMENT.CENTRE_ACCESS',
            'value': 'role'
          }
        ]);

        _.each(data.items, function (item) {
          savedAccess[item.userenrollment] = {};
          savedAccess[item.userenrollment].centreAccess = item.centreAccess;
          savedAccess[item.userenrollment].collectionCentre = item.collectionCentre;
        });

        // initialize submenu
        HeaderService.setSubmenu('study', data.links);
      }

      return data;
    }

    /**
     * openUser
     * @description Click handler for opening a user overview page
     */
    function openUser() {
      if (vm.selected.rel) {
        $location.path(_.convertRestUrl(vm.selected.href, API.prefix));
      }
    }

    /**
     * openAddUser
     * @description Click handler for opening modal window for adding a user to a study
     */
    function openAddUser() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'study/users/addUserModal.tpl.html',
        controller: 'AddUserController',
        controllerAs: 'addUser',
        bindToController: true,
        resolve: {
          centreHref: function () {
            return centreHref;
          }
        }
      });

      modalInstance.result.then(function () {
        $scope.$broadcast('hateoas.client.refresh');
      });
    }

    /**
     * saveChanges
     * @description Click handler for saving any changes that may have occurred with user enrollment dropdowns.
     */
    function saveChanges() {
      $q.all(_.map(vm.resource.items, function (item) {
          // only make PUT request if necessary if selection changed
          if (!_.isEqual(savedAccess[item.userenrollment].centreAccess, item.centreAccess) || !_.isEqual(savedAccess[item.userenrollment].collectionCentre, item.collectionCentre)) {
            var enrollment = new UserEnrollment({
              user: item.id,
              collectionCentre: item.collectionCentre,
              centreAccess: item.centreAccess
            });
            return enrollment.$update({id: item.userenrollment});
          }
          return;
        }))
        .then(function (data) {
          if (!_.all(data, _.isUndefined)) {
            toastr.success('Updated collection centre permissions successfully!', 'Collection Centre');
            $scope.$broadcast('hateoas.client.refresh');
          }
        });
    }

    /**
     * archiveUser
     * @description Click handler for archiving a user
     */
    function archiveUser() {
      var conf = confirm('Are you sure you want to archive this enrollment?');
      if (conf) {
        var enrollment = new UserEnrollment({id: vm.selected.userenrollment});
        return enrollment.$delete({id: vm.selected.userenrollment}).then(function () {
          toastr.success('Archived user enrollment!', 'Enrollment');
          $scope.$broadcast('hateoas.client.refresh');
        });
      }
    }
  }
})();
