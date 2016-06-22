/**
 * @name service-group-preset
 * @description  Helper directive for service-group that manages group and field variables
 * @example
 *    <service-group-preset bound-group-types="services.boundGroupTypes"
 *                   visit-fields="services.visitFields"
 *                   summary-fields="services.summaryFields">
 *    </service-group-preset>
 *
 */
(function() {
  'use strict';

  angular
    .module('altum.referral.serviceGroupPreset', [
    ])
    .component('serviceGroupPreset', {
      bindings: {
        boundGroupTypes: '=',
        visitFields: '=',
        summaryFields: '=',
      },
      templateUrl: 'referral/directives/service-group-preset/service-group-preset.tpl.html',
      controller: 'ServiceGroupPresetController',
      controllerAs: 'serviceGroupPreset'
    })
    .controller('ServiceGroupPresetController', ServiceGroupPresetController);

  ServiceGroupPresetController.$inject = ['$scope', '$resource', 'API', 'AltumAPIService', 'STATUS_TYPES'];

  function ServiceGroupPresetController($scope, $resource, API, AltumAPI, STATUS_TYPES) {
    var vm = this;
    vm.newPresetName = 'Default';

    var ServicePreset = $resource(API.url('servicepreset'), {}, {
      'save' : {method: 'POST', isArray: false}
    });

    vm.serviceGroupPresets = [];

    // bindable methods
    vm.addGroupPreset = addGroupPreset;
    vm.selectGroupPreset = selectGroupPreset;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      ServicePreset.get(function(data) {
        if (_.has(data, 'items')) {
          vm.serviceGroupPresets = data.items;
        } else {
          vm.serviceGroupPresets = data;
        }
      });
    }

    function addGroupPreset() {
      var preset = {
        name: vm.newPresetName,
        preset: {
          boundGroupTypes: angular.copy(vm.boundGroupTypes),
          visitFields: angular.copy(vm.visitFields),
          summaryFields: angular.copy(vm.summaryFields)
        }
      };

      var PresetResource = new ServicePreset(preset);
      PresetResource.$save();

      vm.serviceGroupPresets.push(preset);
    }

    function selectGroupPreset(preset) {
      vm.boundGroupTypes = angular.copy(preset.boundGroupTypes);
      vm.visitFields = angular.copy(preset.visitFields);
      vm.summaryFields = angular.copy(preset.summaryFields);
    }
  }

})();
