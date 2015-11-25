(function() {
  'use strict';

  angular
    .module('dados.subjectportal.controller', [])
    .constant('PORTAL_TABS', [
      {
        prompt: 'Upcoming Surveys',
        value: 'schedule'
      },
      {
        prompt: 'My Studies',
        value: 'study'
      }
    ])
    .controller('SubjectPortalController', SubjectPortalController);

  SubjectPortalController.$inject = [ '$injector', 'ngTableParams', 'sailsNgTable', 'PORTAL_TABS' ];

  function SubjectPortalController($injector, TableParams, SailsNgTable, PORTAL_TABS) {
    var vm = this;

    // bindable variables
    vm.scheduleQuery = { 'where' : {} };
    vm.studyQuery = { 'where': {} };
    vm.scheduleSubjects = [];
    vm.studySubjects = [];

    // bindable methods

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      _.each(PORTAL_TABS, function (tab) {
        vm[tab.value + 'TableParams'] = getPortalTable(tab.value);
      });
    }

    /**
     * getPortalTable
     * @description Returns an ngTableParams definition by type, which are all defined in the PORTAL_TABS constant.
     * @param type  Any tab.value in PORTAL_TABS
     * @returns {Object}
       */
    function getPortalTable(type) {
      return new TableParams({
        page: 1,
        count: 10,
        sorting: { 'studyName': 'ASC' }
      }, {
        groupBy: 'studyName',
        getData: function($defer, params) {
          var api = SailsNgTable.parse(params, vm[type + 'Query']);
          var Resource = $injector.get(_.startCase(type) + 'SubjectService');
          Resource.query(api, function (resource) {
            angular.copy(resource, vm[type + 'Subjects']);
            params.total(resource.total);
            $defer.resolve(resource.items);
          });
        }
      });
    }
  }

})();
