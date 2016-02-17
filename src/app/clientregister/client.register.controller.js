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
        vm.person = {};
        vm.cancelClientAdd = cancelClientAdd;


        init();

        ////////////////

        function init() {
            if (vm.client) {
                vm.person = AltumAPIService.PersonService.get({id: vm.client.personid, populate: ['addresses', 'familyDoctor']});
            }

        }

        vm.employers = [];
        vm.physicians = [];

        vm.onBlur = function () {
            alert("working");
        };

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

                alert("something wrong");
                if (vm.selectedPhysician) {
                    vm.client.FamilyDoctorId = vm.selectedPhysician.id;
                }
                if (vm.selectedEmployer) {
                    vm.client.EmployerId = vm.selectedEmployer.id;
                }
                vm.loading = true;

                clientFactory.client.save(vm.client).success(function (data) {
                    alert("Added Successfully!!");
                    vm.newclient = null;
                    $location.path("/client");
                }).error(function (data) {
                    vm.error = "An Error has occured while Adding Client! " + data;
                    vm.loading = false;

                });
            }
        };

        function cancelClientAdd () {
            vm.client = null;
            $location.path("/client");
            $state.go("hateoas");
        }
    }

})();

