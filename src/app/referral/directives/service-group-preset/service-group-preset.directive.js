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
    .constant('DEFAULT_SERVICE_PRESET_KEY', 'defaults.servicePreset.preset')
    .component('serviceGroupPreset', {
      bindings: {
        boundGroupTypes: '=',
        visitFields: '=',
        summaryFields: '='
      },
      templateUrl: 'referral/directives/service-group-preset/service-group-preset.tpl.html',
      controller: 'ServiceGroupPresetController',
      controllerAs: 'serviceGroupPreset'
    })
    .controller('ServiceGroupPresetController', ServiceGroupPresetController);

  ServiceGroupPresetController.$inject = ['$resource', 'API', 'toastr', 'DEFAULT_SERVICE_PRESET_KEY', 'localStorageService'];

  function ServiceGroupPresetController($resource, API, toastr, DEFAULT_SERVICE_PRESET_KEY, localStorageService) {
    var vm = this;
    var defaultPresetID = localStorageService.get(DEFAULT_SERVICE_PRESET_KEY);
    var ServicePreset = $resource(API.url('servicepreset'), {}, {
      'save' : {method: 'POST', isArray: false}
    });

    // bindable variables
    vm.selected = null;
    vm.permissions = {};
    vm.newPresetName = 'Default';
    vm.serviceGroupPresets = [];
    vm.hasDefaultPreset = _.isNumber(defaultPresetID);

    // bindable methods
    vm.addGroupPreset = addGroupPreset;
    vm.selectGroupPreset = selectGroupPreset;
    vm.setPresetDefault = setPresetDefault;
    vm.unsetPresetDefault = unsetPresetDefault;
    vm.removePreset = removePreset;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      ServicePreset.get(function(data, headers) {
        _.each(headers('allow').split(','), function (permission) {
          vm.permissions[permission] = true;
        });
        if (_.has(data, 'items')) {
          vm.serviceGroupPresets = data.items;
        } else {
          vm.serviceGroupPresets = data;
        }

        var defaultPresetData = _.find(vm.serviceGroupPresets, {id: defaultPresetID});
        if (defaultPresetData) {
          selectGroupPreset(defaultPresetData);
        }
      });
    }

    /**
     * addGroupPreset
     * @description Creates preset and tries to save it
     */
    function addGroupPreset() {
      var defaultName = _.startCase(vm.boundGroupTypes.groupBy) + '/' + _.startCase(vm.boundGroupTypes.subGroupBy);
      var newPresetName = prompt('Please enter a new label for this preset: ', defaultName);
      if (!_.isEmpty(newPresetName)) {
        var preset = {
          name: newPresetName,
          preset: {
            boundGroupTypes: angular.copy(vm.boundGroupTypes),
            visitFields: angular.copy(vm.visitFields),
            summaryFields: angular.copy(vm.summaryFields)
          }
        };

        var PresetResource = new ServicePreset(preset);
        PresetResource.$save(function (response) {
          toastr.success('Configuration preset saved successfully', preset.name);
          vm.serviceGroupPresets.push(response);
        }, function (response) {
          if (response.status === 400) {
            toastr.error(preset.name + ' already exists', 'Service Preset');
          }
        });
      }
    }

    /**
     * selectGroupPreset
     * @description Sets service group configuration variables that will propagate to the parent controller
     * @param item
     */
    function selectGroupPreset(item) {
      vm.selected = angular.copy(item);
      vm.boundGroupTypes = angular.copy(item.preset.boundGroupTypes);
      vm.visitFields = angular.copy(item.preset.visitFields);
      vm.summaryFields = angular.copy(item.preset.summaryFields);
    }

    /**
     * setPresetDefault
     * @description Sets selected servicePreset as default in local storage to load up next time
     */
    function setPresetDefault() {
      localStorageService.set(DEFAULT_SERVICE_PRESET_KEY, vm.selected.id);
      vm.hasDefaultPreset = true;
      toastr.success('Set new default user preset!', vm.selected.name);
    }

    /**
     * unsetPresetDefault
     * @description Unsets default service preset
     */
    function unsetPresetDefault() {
      localStorageService.remove(DEFAULT_SERVICE_PRESET_KEY);
      vm.hasDefaultPreset = false;
      toastr.success('Cleared default user presets!', 'Service Preset');
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
