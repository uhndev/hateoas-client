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
          vm.client.person.address.city = AltumAPIService.City.get({id: data.address.city});}
          vm.client.person.employments = AltumAPIService.Employee.query({
            person: vm.client.personid,
            populate: 'company'
          });
          if (data.familyDoctor.person) {
          vm.client.person.familyDoctor.person = AltumAPIService.Person.get({id: data.familyDoctor.person});}
          if (data.primaryEmergencyContact) {
          vm.client.person.primaryEmergencyContact = AltumAPIService.EmergencyContact.get({id: data.primaryEmergencyContact});}
          // vm.client.person.emergencyContacts = AltumAPIService.EmergencyContact.query({person: vm.client.personid});

        });
      }
    }

    function addEmployee() {
      alert('employee function called');
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
                },
                    function (err) {
                      toastr.error('Updating client ' + 'failed. ' + err);
                    });
    }

    function clientAdd() {
      var newClient = new AltumAPIService.Client();

      newClient.$save()
                .then(function (resap) {
                  toastr.success('New client created');
                },
                    function (err) {
                      toastr.error('failed to created the client');
                    });
    }

  }

})();

