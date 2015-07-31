(function() {
  'use strict';
  angular
    .module('dados.subject.controller', [
      'dados.subject.service',
      'dados.common.services.resource',
      'dados.common.directives.selectLoader',
      'dados.common.directives.simpleTable'
    ])
    .controller('SubjectOverviewController', SubjectOverviewController);

  SubjectOverviewController.$inject = [
    '$scope', '$location', 'API', 'ResourceFactory'
  ];

  function SubjectOverviewController($scope, $location, API, ResourceFactory) {
    var vm = this;

    // bindable variables
    vm.allow = '';
    vm.template = {};
    vm.resource = {};
    vm.url = API.url() + $location.path();

    // bindable methods

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var SubjectEnrollment = ResourceFactory.create(vm.url);
      SubjectEnrollment.get(function(data, headers) {
        vm.allow = headers('allow');
        vm.template = data.template;
        vm.resource = angular.copy(data);
      });
    }

    $scope.$on('hateoas.client.refresh', function() {
      init();
    });
  }
})();
