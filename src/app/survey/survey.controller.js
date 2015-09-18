(function() {
  'use strict';
  angular
    .module('dados.survey.controller', [
      'dados.survey.service',
      'dados.common.services.resource'
    ])
    .controller('SurveyOverviewController', SurveyOverviewController);

  SurveyOverviewController.$inject = [
    '$scope', '$resource', '$location', '$modal', 'API', 'NgTableParams', 'AuthService'
  ];

  function SurveyOverviewController($scope, $resource, $location, $modal, API, TableParams, AuthService) {
    var vm = this;

    // bindable variables
    vm.tableParams = {};
    vm.allow = {};
    vm.template = {};
    vm.resource = {};
    vm.url = API.url() + $location.path();

    // bindable methods

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Survey = $resource(vm.url);
      Survey.get(function(data, headers) {
        vm.template = data.template;
        vm.resource = angular.copy(data.items);
        var permissions = headers('allow').split(',');
        _.each(permissions, function (permission) {
          vm.allow[permission] = true;
        });
        // initialize submenu
        AuthService.setSubmenu(vm.resource.studySessions.study.name, data, $scope.dados.submenu);

        vm.tableParams = new TableParams({
          page: 1,
          count: 10
        }, {
          groupBy: "type",
          data: _.sortBy(vm.resource.studySessions.sessions, 'timepoint')
        });
      });
    }
  }
})();
