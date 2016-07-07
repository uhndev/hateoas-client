/**
 * Created by calvinsu on 2016-01-22.
 */
(function () {
  'use strict';

  angular
    .module('altum.client.register.controller', [])
    .controller('ClientRegisterController', ClientRegisterController);

  ClientRegisterController.$inject = ['$scope', 'resolvedClient', 'resolvedPerson', 'AltumAPIService', '$location', '$state', 'toastr', 'DefaultRouteService'];

  function ClientRegisterController($scope, resolvedClient, resolvedPerson, AltumAPIService, $location, $state, toastr, DefaultRoute) {
    var vm = this;

    vm.client = resolvedClient;
    vm.prefixes = _.find(resolvedPerson.template.data, {name: 'prefix'}).value;
    vm.genders = _.find(resolvedPerson.template.data, {name: 'gender'}).value;
    vm.cancelClientAdd = cancelClientAdd;
    vm.addEmployee = addEmployee;
    vm.removeEmployment = removeEmployment;
    vm.save = save;
    vm.clientAdd = clientAdd;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      if (vm.client.id) {
        AltumAPIService.Person.get({
          id: vm.client.personId,
          populate: ['address', 'familyDoctor', 'employments']
        }, function (data) {
          vm.client.person = data;
          if (data.address.city) {
            vm.client.person.address.city = AltumAPIService.City.get({id: data.address.city});
          }
          vm.client.person.employments = AltumAPIService.Employee.query({
            person: vm.client.personId,
            populate: 'company'
          });
          if (_.has(data.familyDoctor, 'person')) {
            vm.client.person.familyDoctor.person = AltumAPIService.Person.get({id: data.familyDoctor.person});
          }
          if (data.primaryEmergencyContact) {
            vm.client.person.primaryEmergencyContact = AltumAPIService.EmergencyContact.get({id: data.primaryEmergencyContact});
          }
        });
      }
    }

    /**
     * addEmployee
     * @description this is for add empty Employee object to the employments array
     */
    function addEmployee() {
      var employee = {};
      vm.client.person.employments.push(employee);
    }

    /**
     * removeEmployment
     * @description Removes an employment accordion from the work section
     * @param index
     * @param event
     */
    function removeEmployment(index, event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      vm.client.person.employments.splice(index, 1);
    }

    /**
     * cancelClientAdd
     * @description Click handler for navigating back to the clients page
     */
    function cancelClientAdd() {
      vm.client = null;
      $location.path('/client');
      $state.go('hateoas');
    }

    /**
     * save
     * @description Function for updating an existing client
     */
    function save() {
      vm.client.$update().then(function (resp) {
        toastr.success('Updated client: ' + resp.items.displayName + '!', 'Client Registration');
        $location.path('/client');
        $state.go('hateoas');
      },
      function (err) {
        console.log('Updating client ' + 'failed. ' + err);
      });
    }

    /**
     * clientAdd
     * @description Function for adding a new client
     * @param isValid
     */
    function clientAdd(isValid) {
      var newClient = new AltumAPIService.Client();
      newClient.MRN = vm.client.MRN;
      newClient.person = vm.client.person;
      newClient.$save().then(function (resp) {
        toastr.success('Registered new client: ' + resp.displayName + '!', 'Client Registration');
        $location.path('/client');
        $state.go('hateoas');
      },
      function (err) {
        console.log('failed to created the client');
      });
    }

    // hitting back button triggers this event, which should then try to resolve whatever the previous state was
    $scope.$on('$locationChangeStart', function (e, currentHref, prevHref) {
      if ($state.is('editClient') || $state.is('newClient') && prevHref !== currentHref) {
        DefaultRoute.resolve();
      }
    });

  }

})();
