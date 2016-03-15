(function () {
  'use strict';

  angular
    .module('dados.common.directives.subjectForms.controller', [
      'dados.common.services.resource'
    ])
    .controller('SubjectFormsController', SubjectFormsController);

  SubjectFormsController.$inject = ['$scope', '$resource', '$location', 'API'];

  function SubjectFormsController($scope, $resource, $location, API) {
    var vm = this;

    vm.formVersions = [];

    init();

    function init() {
      vm.url = API.url() + '/subjectschedule/' + vm.schedule + '/form/';
      var Session = $resource(API.url() + '/session/' + vm.session);

      Session.get(function(data) {
        if (_.has(data, 'items')) {
          _.each(data.items.formVersions, function(version) {
            vm.formVersions.push(version.id);
          });
          vm.formOrder = _.intersection(data.items.formOrder, vm.formVersions);

          if (_.isArray(vm.formOrder) && vm.formOrder.length) {
            vm.current = 0;
            loadForm();
          }
        }
      });
    }

    /**
     * loadForm
     * @description        Function that tries to get current form based on formOrder
     */
    function loadForm() {
      var SubjectSchedule = $resource(vm.url + vm.formOrder[vm.current]);

      SubjectSchedule.get(function(data) {
        if (_.has(data, 'items')) {
          vm.currentForm = data.items;
        } else {
          vm.currentForm = data;
        }
      });
    }

    /**
     * NextFormRequest
     * @description Event that fires from dadosForm controller
     *              when last question on the current form is reached.
     */
    $scope.$on('NextFormRequest', function () {
      if (vm.current < vm.formOrder.length - 1) {
        vm.current++;
        loadForm();
      }
    });

    /**
     * PrevFormRequest
     * @description Event that fires from dadosForm controller
     *              when first question on the current form is reached.
     */
    $scope.$on('PrevFormRequest', function () {
      if (vm.current > 0) {
        vm.current--;
        loadForm();
      }
    });

    $scope.$watchGroup(['subjectForms.schedule', 'subjectForms.session'],
      function(newValues, oldValues, scope) {
        if (newValues[0] !== oldValues[0] || newValues[1] !== oldValues[1]) {
          init();
        }
      });
  }
})();
