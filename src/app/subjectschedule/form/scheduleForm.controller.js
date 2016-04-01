(function() {
  'use strict';
  angular
    .module('dados.schedule.form.controller', [
      'dados.common.services.resource'
    ])
    .controller('ScheduleFormController', ScheduleFormController);

  ScheduleFormController.$inject = [
    '$scope', '$resource', '$location', 'toastr', 'API', 'AuthService'
  ];

  function ScheduleFormController($scope, $resource, $location, toastr, API, AuthService) {
    var vm = this;

    // bindable variables
    vm.url = API.url() + $location.path();

    init();

    function init() {
      var SubjectSchedule = $resource(vm.url);

      SubjectSchedule.get(function(data, headers) {
        if (_.has(data, 'items')) {
          vm.form = data.items;
        } else {
          vm.form = data;
        }
        $scope.$broadcast('FormLoaded', vm.form);
      });
    }
  }
})();
