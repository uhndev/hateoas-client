(function () {
    'use strict';

    angular
      .module('altum.client.controller', ['ngMaterial',
        'ngResource',
        'dados.header.service'])
      .controller('ClientController', ClientController);

    ClientController.$inject = ['$resource', '$location', 'API', 'HeaderService'];

    function ClientController($resource, $location, API, HeaderService) {
      var vm = this;

      // bindable variables
      vm.url = API.url() + $location.path();
      init();

      function init() {
        var Resource = $resource(vm.url);
        Resource.get(function (data, headers) {
          vm.allow = headers('allow');
          vm.template = data.template;
          vm.client = angular.copy(data.items);

        });

      }
    }
  }
  )();
