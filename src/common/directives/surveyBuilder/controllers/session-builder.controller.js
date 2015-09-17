(function() {
  'use strict';

  angular
    .module('dados.common.directives.sessionBuilder.controller', [])
    .controller('SessionBuilderController', SessionBuilderController);

  SessionBuilderController.$inject = [];

  function SessionBuilderController() {
    var vm = this;

    // bindable variables
    vm.session = vm.session || {};   // the session object we are creating
    vm.generateSessions = vm.generateSessions || function(data) { return data; };

    // bindable methods
    vm.isSessionValid = isSessionValid;

    ///////////////////////////////////////////////////////////////////////////

    function isSessionValid() {
      var valid = vm.session.timepoint >= 0 && vm.session.availableFrom >= 0 && vm.session.availableTo >= 0;
      switch(vm.session.type) {
        case 'scheduled': return valid && vm.session.repeat >= 0;
        case 'non-scheduled': return valid && vm.session.name;
        default: return false;
      }
    }
  }

})();
