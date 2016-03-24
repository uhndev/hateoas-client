(function() {
  'use strict';

  angular
    .module('dados.subjectportal.forms.controller', [])
    .controller('SubjectPortalFormsController', SubjectPortalFormsController);

  SubjectPortalFormsController.$inject = ['$state', '$stateParams'];

  function SubjectPortalFormsController($state, $stateParams) {
    var vm = this;

    // bindable variables
    vm.sessionID = $stateParams.sessionID;
    vm.scheduleID = $stateParams.scheduleID;

    // bindable methods
  }

})();
