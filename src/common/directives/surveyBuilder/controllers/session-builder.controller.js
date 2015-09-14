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

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
    }
  }

})();
