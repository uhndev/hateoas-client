/**
 * @name service-variation-editor
 * @description Angular component that abstracts the functionality for editing variations in services
 */

(function() {
  'use strict';

  angular
    .module('dados.common.directives.serviceEditor')
    .constant('VARIATION_FIELDS', [
      'number', 'text', 'date', 'physician', 'staff', 'timeframe', 'measure'
    ])
    .controller('ServiceVariationEditor', ServiceVariationEditor)
    .component('serviceVariationEditor', {
      bindings: {
        horizontal: '@?',           // boolean for whether or not we want horizontal form
        service: '='                // required service object to edit
      },
      templateUrl: 'directives/modelEditors/serviceEditor/service-variation-editor.tpl.html',
      controller: 'ServiceVariationEditor',
      controllerAs: 'variationEditor'
    });

  ServiceVariationEditor.$inject = ['VARIATION_TYPES', 'VARIATION_FIELDS'];

  function ServiceVariationEditor(VARIATION_TYPES, VARIATION_FIELDS) {
    var vm = this;

    // bindable variables
    vm.horizontal = vm.horizontal == 'true' || false;
    vm.service = vm.service || {};
    vm.availableFields = _.filter(VARIATION_TYPES, function (variation) {
      var isAvailable = _.contains(VARIATION_FIELDS, variation.type) && _.isString(vm.service[variation.type + 'DetailName']);
      if (isAvailable && variation.type === 'date') {
        vm.service.dateDetail = new Date(vm.service.dateDetail);
      }
      // only include field if included in VARIATION_FIELDS and corresponding DetailName set in service
      return isAvailable;
    });
  }

})();
