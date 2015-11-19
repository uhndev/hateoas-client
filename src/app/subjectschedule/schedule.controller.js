(function() {
  'use strict';
  angular
    .module('dados.schedule.controller', [
      'dados.common.services.resource',
      'dados.common.directives.selectLoader',
      'dados.common.directives.simpleTable'
    ])
    .controller('ScheduleController', ScheduleController);

  ScheduleController.$inject = [
    '$scope', '$resource', '$location', 'toastr', 'API', 'AuthService'
  ];

  function ScheduleController($scope, $resource, $location, toastr, API, AuthService) {
    var vm = this;

    // bindable variables
    vm.url = API.url() + $location.path();

    // bindable methods
    
    
    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var SubjectSchedule = $resource(vm.url);
      
      SubjectSchedule.get(function(data, headers) {
        if (_.has(data, 'items')) {
          vm.form = data.items;
        } else {
          vm.form = data;
        }
        $scope.$broadcast("FormLoaded", vm.form);
      });
    }
  }
})();
