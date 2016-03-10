/**
 * Created by calvinsu on 2016-01-22.
 */
(function () {
    'use strict';

    angular
        .module('altum.client.register.controller', [])
        .controller('ClientRegisterController', ClientRegisterController);

    ClientRegisterController.$inject = ['resolvedClient', 'AltumAPIService', '$location', '$state'];

    /* @ngInject */
    function ClientRegisterController(resolvedClient, AltumAPIService, $location, $state) {
        var vm = this;

        vm.client = resolvedClient;
        vm.emergencyContacts = [];
        vm.cancelClientAdd = cancelClientAdd;
        vm.addEmployee = addEmployee;

        init();

        ////////////////

        function init() {
            if (vm.client) {
                AltumAPIService.PersonService.get({
                    id: vm.client.personid,
                    populate: ['address', 'familyDoctor', 'employments']
                }, function (data) {
                    vm.person = data;
                    vm.city = AltumAPIService.CityService.get({id: data.address.city});
                    vm.personCompanies = AltumAPIService.EmployeeService.query({person: vm.client.personid, populate: 'company'});
                    vm.familyDoctorPerson = AltumAPIService.PersonService.get({id: vm.person.familyDoctor.person});
                });
                vm.emergencyContacts = AltumAPIService.EmergencyContactService.query({person: vm.client.personid});
            }
        }


        vm.employers = [];
        vm.physicians = [];

        vm.onBlur = function () {
            alert('working');
        };

        function addEmployee (){
            alert("employee function called");
          var employee = {
          };
            vm.personCompanies.push(employee);
        }

        vm.updateEmployers = function (str) {

            vm.employers = clientFactory.getEmployerListByCompanyName(str);
        };

        vm.setSelectedEmployer = function (selected) {

            vm.selectedEmployer = selected;

        };

        vm.updatePhysicians = function (str) {
            vm.physicians = clientFactory.familyDoctorList(str);
        };

        vm.setSelectedPhysician = function (selected) {
            vm.selectedPhysician = selected;
        };

        vm.clientAdd = function (isValid) {

            if (isValid) {

                alert('something wrong');
                if (vm.selectedPhysician) {
                    vm.client.FamilyDoctorId = vm.selectedPhysician.id;
                }
                if (vm.selectedEmployer) {
                    vm.client.EmployerId = vm.selectedEmployer.id;
                }
                vm.loading = true;

                clientFactory.client.save(vm.client).success(function (data) {
                    alert('Added Successfully!!');
                    vm.newclient = null;
                    $location.path('/client');
                }).error(function (data) {
                    vm.error = 'An Error has occured while Adding Client! ' + data;
                    vm.loading = false;

                });
            }
        };

        function cancelClientAdd() {
            vm.client = null;
            $location.path('/client');
            $state.go('hateoas');
        }
    }

})();

