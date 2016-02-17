(function () {
  'use strict';

  angular
      .module('altum.client', [])
      .controller('ClientController', ClientController);

  ClientController.$inject = [];

  /* @ngInject */
  function ClientController() {
    var vm = this;
    vm.title = 'ClientController';

    init();

    ////////////////

    function init() {
        }
  }

})();

