(function () {
  'use strict';

  angular
    .module('altum.client.controller', [
    ])
    .controller('ClientController', ClientController);

  ClientController.$inject = ['$resource', '$location', 'API', 'HeaderService'];

  function ClientController($resource, $location, API, HeaderService) {

  }

})();
