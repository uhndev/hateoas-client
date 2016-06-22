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

  ServiceGroupPresetController.$inject = ['$scope', '$resource', 'API', 'toastr', 'AuthService'];

  function ServiceGroupPresetController($scope, $resource, API, toastr, AuthService) {
    var vm = this;
    vm.isAdmin = AuthService.isAdmin();
    vm.newPresetName = 'Default';

    var ServicePreset = $resource(API.url('servicepreset'), {}, {
      'save' : {method: 'POST', isArray: false}
    });

    vm.serviceGroupPresets = [];

    // bindable methods
    vm.addGroupPreset = addGroupPreset;
    vm.selectGroupPreset = selectGroupPreset;
    vm.removePreset = removePreset;

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

    /**
     * addGroupPreset
     * @description Creates preset and tries to save it
     */
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
      PresetResource.$save(function(response) {
        toastr.success('Configuration preset saved successfully', preset.name);
        vm.serviceGroupPresets.push(response);
      }, function(response) {
        if (response.status === 400) {
          toastr.error(preset.name + ' already exists', 'Service Preset');
        }
      });

    }

    /**
     * selectGroupPreset
     * @description Sets service group configuration variables that will propagate to the parent controller
     * @param item
     */
    function selectGroupPreset(item) {
      vm.boundGroupTypes = angular.copy(item.preset.boundGroupTypes);
      vm.visitFields = angular.copy(item.preset.visitFields);
      vm.summaryFields = angular.copy(item.preset.summaryFields);
    }

    /**
     * removePreset
     * @description Deletes selected service preset
     * @param name
     */
    function removePreset(name) {
      var toRemove = _.findIndex(vm.serviceGroupPresets, function(preset) {
        return name == preset.name;
      });

      if (toRemove !== -1) {
        ServicePreset.remove({id: vm.serviceGroupPresets[toRemove].id}, function() {
          vm.serviceGroupPresets.splice(toRemove, 1);
        });
      }
    }
  }

})();
