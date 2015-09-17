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
    vm.isSessionInvalid = isSessionInvalid;

    ///////////////////////////////////////////////////////////////////////////

    function isSessionInvalid() {
      var valid = !vm.session.timepoint || !vm.session.availableFrom || !vm.session.availableTo;
      switch(vm.session.type) {
        case 'scheduled': return valid || !vm.session.repeat;
        case 'non-scheduled': return valid || !vm.session.name;
        default: return false;
      }
    }
  }

})();
