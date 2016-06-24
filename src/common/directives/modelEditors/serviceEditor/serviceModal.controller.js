(function() {
  'use strict';
  angular
    .module('dados.common.directives.serviceEditor')
    .controller('ServiceModalController', ServiceModalController);

  ServiceModalController.$inject = ['$uibModalInstance', 'Service', 'ApprovedServices', 'ServiceEditorConfig', 'AltumAPIService', 'toastr'];

  function ServiceModalController($uibModalInstance, Service, ApprovedServices, ServiceEditorConfig, AltumAPI, toastr) {
    var vm = this;

    // bindable variables
    vm.service = Service;
    vm.approvedServices = ApprovedServices;
    vm.editorConfig = ServiceEditorConfig;

    // bindable methods
    vm.saveService = saveService;
    vm.cancel = cancel;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * saveService
     * @description Click handler for the save button in the service modal window.
     */
    function saveService() {
      // for recommended services that have variations selected, apply to object to be sent to server
      if (!_.isEmpty(vm.service.savedSelections)) {
        _.each(vm.service.savedSelections, function (value, key) {
          switch (key) {
            case 'service':
              vm.service.altumService = vm.service.savedSelections.service.value.altumService;
              vm.service.programService = vm.service.savedSelections.service.value.programService;
              vm.service.name = vm.service.savedSelections.name;
              break;
            case 'followup':
              vm.service.followupPhysicianDetail = vm.service.savedSelections[key].value.physician;
              vm.service.followupTimeframeDetail = vm.service.savedSelections[key].value.timeframe;
              break;
            default:
              // otherwise, variation is of type number/text/date/physician/staff/timeframe/measure
              // where the respective backend column name will be <type>DetailName and value will be <type>Detail
              vm.service[key + 'DetailName'] = vm.service.savedSelections[key].name;
              vm.service[key + 'Detail'] = vm.service.savedSelections[key].value;
              break;
          }
        });
      }

      AltumAPI.Service.update(vm.service, function (data) {
        toastr.success('Successfully saved service ' + vm.service.displayName, 'Service');
        $uibModalInstance.close(vm.service);
      });
    }

    /**
     * cancel
     * @description Cancels and closes the modal window
     */
    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }
  }
})();
