(function () {
  'use strict';

  angular
    .module('altum.servicemapper', [
      'dados.common.directives.formBuilder'
    ])
    .controller('ServiceMapperController', ServiceMapperController);

  ServiceMapperController.$inject = ['AltumServiceService', 'ProgramServiceService', 'TemplateService', '$resource', 'toastr', 'API', '$uibModal'];

  function ServiceMapperController(AltumService, ProgramService, TemplateService, $resource, toastr, API, $uibModal) {
    var vm = this;

    var modalSettings = {
      animation: true,
      template: '<form-directive form="modalForm.serviceForm" ' +
      'on-submit="modalForm.confirm()" ' +
      'on-cancel="modalForm.cancel()">' +
      '</form-directive>',
      controller: function (serviceForm, $uibModalInstance) {
        var vm = this;

        // bindable variables
        vm.serviceForm = serviceForm;

        /**
         * confirm
         * @description Returns the approval object upon confirmation
         */
        vm.confirm = function () {
          $uibModalInstance.close(TemplateService.formToObject(vm.serviceForm));
        };

        /**
         * cancel
         * @description cancels and closes the modal window
         */
        vm.cancel = function () {
          $uibModalInstance.dismiss();
        };
      },
      controllerAs: 'modalForm',
      bindToController: true
    };

    // bindable variables
    vm.current = 'programservice';
    vm.currentIndex = 0;
    vm.mappings = {
      'programservice': {
        heading: 'APP.SERVICEMAPPER.TABS.ALTUM_SERVICE',
        association: 'altumservice',
        collection: 'AHServices',
        populate: ['sites', 'staffTypes']
      },
      'altumservice': {
        heading: 'APP.SERVICEMAPPER.TABS.PROGRAM_SERVICE',
        association: 'programservice',
        collection: 'programServices'
      }
    };

    _.each(['altumservice', 'programservice'], function (tab, idx) {
      vm[tab] = {
        index: idx,
        selected: null,
        query: {},
        resource: {}
      };
    });

    // each tab includes a fetchDetailInfo function to be called when selecting a row from a table.
    vm.tabs = [
      {
        heading: 'APP.SERVICEMAPPER.TABS.PROGRAM_SERVICES',
        url: 'programservice',
        services: 'AHServices',
        onResourceLoaded: function (data) {
          if (data) {
            data.template.data = _.filter(data.template.data, function (field) {
              return ['displayName', 'program', 'payor'].includes(field.name);
            });
          }
          return data;
        }
      },
      {
        heading: 'APP.SERVICEMAPPER.TABS.ALTUM_SERVICES',
        url: 'altumservice',
        services: 'programServices',
        onResourceLoaded: function (data) {
          if (data) {
            data.template.data = _.filter(data.template.data, {name: 'name'});
          }
          return data;
        }
      }
    ];

    // bindable methods
    vm.selectTab = selectTab;
    vm.editService = editService;
    vm.removeService = removeService;
    vm.addExistingService = addExistingService;
    vm.openAddService = openAddService;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * selectTab
     * @description Convenience method for selecting a tab
     * @param tab
     */
    function selectTab(tab) {
      vm.current = tab.url;
      vm.currentIndex = vm[tab.url].index;
      vm.selectedService = null;
    }

    /**
     * editService
     * @description Opens modal window for editing an altum/program service mapping
     */
    function editService(service) {
      var modalInstance = $uibModal.open(_.merge({
        resolve: {
          serviceForm: function ($resource) {
            var query = {id: service.id};
            var Resource = (vm.current === 'altumservice') ? ProgramService : AltumService;
            if (vm.mappings[vm.current].populate) {
              query.populate = vm.mappings[vm.current].populate;
            }

            return Resource.get(query).$promise.then(function (serviceData) {
              var formType = vm.mappings[vm.current].association;
              var SystemForm = $resource(vm[formType].resource.template.href);
              return SystemForm.get().$promise.then(function (data) {
                var form = data;
                TemplateService.loadAnswerSet(serviceData, vm[formType].resource.template, form);
                return form.items;
              });
            });
          }
        }
      }, modalSettings));

      modalInstance.result.then(function (result) {
        var Service = (vm.current === 'altumservice') ? new ProgramService(result) : new AltumService(result);
        Service.$update({id: service.id}, function (data) {
          toastr.success('Updated service: ' + service.displayName, 'Service Mapper');
          angular.copy(data.items, service);
        });
      });
    }

    /**
     * removeService
     * @description Removes a mapping from an altum/program service mapping
     */
    function removeService(service) {
      if (confirm('Are you sure you want to remove this mapping: ' + service.displayName + ' from ' + vm[vm.current].selected.displayName + '?')) {
        var savedSelected = vm[vm.current].selected.id;
        var collection = vm.mappings[vm.current].collection;
        var Service = $resource([API.url(), vm.current, vm[vm.current].selected.id, collection, service.id].join('/'));
        Service.remove(function (data) {
          toastr.success('Removed service mapping for ' + vm[vm.current].selected.displayName, 'Service Mapper');
          angular.copy(data.items[collection], _.find(vm[vm.current].resource.items, {id: savedSelected})[collection]);
        });
      }
    }

    /**
     * addExistingService
     * @description Creates a mapping between existing altum/program services
     */
    function addExistingService() {
      var collection = vm.mappings[vm.current].collection;
      if (!_.map(vm[vm.current].selected[collection], 'id').includes(vm.selectedService.id)) {
        var savedSelected = vm[vm.current].selected.id;
        var Service = $resource([API.url(), vm.current, vm[vm.current].selected.id, collection, vm.selectedService.id].join('/'));
        Service.save(function (data) {
          toastr.success('Added service mapping from ' + vm[vm.current].selected.displayName + ' to ' + vm.selectedService.displayName, 'Service Mapper');
          angular.copy(data.items[collection], _.find(vm[vm.current].resource.items, {id: savedSelected})[collection]);
          vm.selectedService = null;
        });
      } else {
        toastr.warning('Service mapping already exists for ' + vm.selectedService.displayName, 'Service Mapper');
        vm.selectedService = null;
      }
    }

    /**
     * openAddService
     * @description Click handler for adding altum/program service to current service
     */
    function openAddService() {
      var modalInstance = $uibModal.open(_.merge({
        resolve: {
          serviceForm: function ($resource) {
            var formType = vm.mappings[vm.current].association;
            var SystemForm = $resource(vm[formType].resource.template.href);
            return SystemForm.get().$promise.then(function (data) {
              return data.items;
            });
          }
        }
      }, modalSettings));

      modalInstance.result.then(function (result) {
        var savedSelected = vm[vm.current].selected.id;
        var collection = vm.mappings[vm.current].collection;
        var Service = $resource([API.url(), vm.current, vm[vm.current].selected.id, collection].join('/'));
        Service.save(result, function (data) {
          toastr.success('Added service mapping for ' + vm[vm.current].selected.displayName, 'Service Mapper');
          angular.copy(data.items[collection], _.find(vm[vm.current].resource.items, {id: savedSelected})[collection]);
        });
      });
    }
  }

})();

