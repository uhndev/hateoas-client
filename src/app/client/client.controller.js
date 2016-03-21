/**
 * Created by calvinsu on 2016-03-15.
 */
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
