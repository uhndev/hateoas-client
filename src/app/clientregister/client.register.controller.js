/**
 * Created by calvinsu on 2016-01-22.
 */
(function () {
  'use strict';

  angular
    .module('altum.client.register.controller', [])
    .controller('ClientRegisterController', ClientRegisterController);

  ClientRegisterController.$inject = ['resolvedClient', 'AltumAPIService', '$location', '$state', 'toastr'];

  /* @ngInject */
  function ClientRegisterController(resolvedClient, AltumAPIService, $location, $state, toastr) {
    var vm = this;

    vm.client = resolvedClient;

    vm.cancelClientAdd = cancelClientAdd;
    vm.addEmployee = addEmployee;
    vm.save = save;
    vm.clientAdd = clientAdd;

    init();

    ////////////////

    function init() {
      if (vm.client.id) {
        AltumAPIService.Person.get({
          id: vm.client.personid,
          populate: ['address', 'familyDoctor', 'employments']
        }, function (data) {
          vm.client.person = data;
          if (data.address.city) {
            vm.client.person.address.city = AltumAPIService.City.get({id: data.address.city});
          }
          vm.client.person.employments = AltumAPIService.Employee.query({
            person: vm.client.personid,
            populate: 'company'
          });
          if (data.familyDoctor.person) {
            vm.client.person.familyDoctor.person = AltumAPIService.Person.get({id: data.familyDoctor.person});
          }
          if (data.primaryEmergencyContact) {
            vm.client.person.primaryEmergencyContact = AltumAPIService.EmergencyContact.get({id: data.primaryEmergencyContact});
          }
          // vm.client.person.emergencyContacts = AltumAPIService.EmergencyContact.query({person: vm.client.personid});

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

    function cancelClientAdd() {
      vm.client = null;
      $location.path('/client');
      $state.go('hateoas');
    }

    function save() {
      //update client
      vm.client.$update()
        .then(function (resp) {
            toastr.success('Updated client ' + resp.id + '!');
            $location.path('/client');
            $state.go('hateoas');
          },
          function (err) {
            console.log('Updating client ' + 'failed. ' + err);
          });
    }

    /**
     *
     * @param isValid
     */
    function clientAdd(isValid) {
      var newClient = new AltumAPIService.Client();
      newClient.MRN = vm.client.MRN;
      newClient.person = vm.client.person;
      newClient.$save()
        .then(function (resp) {
            toastr.success('New client created');
            $location.path('/client');
            $state.go('hateoas');
          },
          function (err) {
            toastr.error('failed to created the client');
          });
    }

  }

})();

