(function() {
  'use strict';

  angular
    .module('dados.subjectportal.controller', [])
    .controller('SubjectPortalController', SubjectPortalController);

  SubjectPortalController.$inject = [ '$state' ];

  function SubjectPortalController($state) {
    var vm = this;

    // bindable variables
    vm.tabs = [
      {
        title: 'APP.SUBJECT_PORTAL.SURVEYS.TAB_TITLE',
        state: 'subjectportal.surveys',
        active: false
      },
      {
        title: 'APP.SUBJECT_PORTAL.PROFILE.TAB_TITLE',
        state: 'subjectportal.profile',
        active: false
      }
    ];

    // bindable methods
    vm.follow = follow;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      _.map(vm.tabs, function (tab) {
        tab.active = $state.is(tab.state);
      });
    }

    function follow(tab) {
      $state.go(tab.state);
      tab.active = true;
    }
  }

})();
