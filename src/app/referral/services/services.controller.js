(function () {
  'use strict';

  angular
    .module('altum.referral.services', [
      'ngMaterial',
      'ngResource',
      'toastr',
      'dados.header.service',
      'dados.common.services.altum',
      'altum.referral.serviceStatus'
    ])
    .controller('ServicesController', ServicesController);

  ServicesController.$inject = [
    '$resource', '$location', '$uibModal', 'API', 'HeaderService', 'AltumAPIService', 'RecommendationsService'
  ];

  function ServicesController($resource, $location, $uibModal, API, HeaderService, AltumAPI, RecommendationsService) {
    var vm = this;
    vm.DEFAULT_GROUP_BY = 'statusName';
    vm.DEFAULT_SUBGROUP_BY = 'siteName';

    // bindable variables
    vm.url = API.url() + $location.path();
    vm.referralNotes = [];
    vm.accordionStatus = {};
    vm.boundGroupTypes = {
      groupBy: vm.DEFAULT_GROUP_BY,
      subGroupBy: vm.DEFAULT_SUBGROUP_BY
    };

    // data columns for subgroups (encounter) summary table
    vm.summaryFields = [
      {
        name: 'workStatusName',
        prompt: 'COMMON.MODELS.SERVICE.WORK_STATUS'
      },
      {
        name: 'prognosisName',
        prompt: 'COMMON.MODELS.SERVICE.PROGNOSIS'
      },
      {
        name: 'prognosisTimeframeName',
        prompt: 'COMMON.MODELS.SERVICE.PROGNOSIS_TIMEFRAME'
      }
    ];

    // array of options denoting which groups can be bound to (vm.boundGroupTypes.groupBy)
    vm.groupTypes = [
      {name: 'groupBy', prompt: 'Group'},
      {name: 'subGroupBy', prompt: 'Subgroup'}
    ];

    // data columns for main groups (visits)
    vm.groupFields = [
      {
        name: 'serviceGroupByDate',
        prompt: 'COMMON.MODELS.SERVICE.SERVICE_DATE'
      },
      {
        name: 'statusName',
        prompt: 'COMMON.MODELS.SERVICE.CURRENT_STATUS'
      },
      {
        name: 'completionStatusName',
        prompt: 'COMMON.MODELS.SERVICE.COMPLETION_STATUS'
      },
      {
        name: 'siteName',
        prompt: 'COMMON.MODELS.SERVICE.SITE'
      },
      {
        name: 'altumServiceName',
        prompt: 'COMMON.MODELS.SERVICE.ALTUM_SERVICE'
      },
      {
        name: 'physician_displayName',
        prompt: 'COMMON.MODELS.SERVICE.PHYSICIAN'
      }
    ];

    // data columns for groups (visits)
    vm.visitFields = [
      {
        name: 'altumServiceName',
        prompt: 'COMMON.MODELS.SERVICE.ALTUM_SERVICE'
      },
      {
        name: 'physician_displayName',
        prompt: 'COMMON.MODELS.SERVICE.PHYSICIAN'
      },
      {
        name: 'siteName',
        prompt: 'COMMON.MODELS.SERVICE.SITE'
      },
      {
        name: 'serviceDate',
        prompt: 'COMMON.MODELS.SERVICE.SERVICE_DATE'
      },
      {
        name: 'visitServiceName',
        prompt: 'COMMON.MODELS.SERVICE.VISIT_SERVICE'
      }
    ];

    vm.init = init;
    vm.openServiceEditor = openServiceEditor;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var Resource = $resource(vm.url);

      Resource.get(function (data, headers) {
        vm.referral = angular.copy(data.items);

        //email fields for sending email from note directive
        vm.emailInfo = {
          template: 'referral',
          data: {
            claim: vm.referral.claimNumber,
            client: vm.referral.client_displayName
          },
          options: {
            subject:  'Altum CMS Communication for' + ' ' + vm.referral.client_displayName
          }
        };

        vm.referralNotes = AltumAPI.Referral.get({id: vm.referral.id, populate: 'notes'});

        // parse serviceDate dates and add serviceGroupByDate of just the day to use as group key
        vm.services = _.map(data.items.recommendedServices, function (service) {
          service.serviceGroupByDate = moment(service.serviceDate).startOf('day').format('dddd, MMMM Do YYYY');
          service.serviceDate = moment(service.serviceDate).format('MMM D, YYYY h:mm a');
          service.visitServiceName = (service.visitService) ? service.visitService.displayName : '-';
          return service;
        });

        // initialize submenu
        HeaderService.setSubmenu('referral', data.links);

        if (vm.referral.program) {
          vm.recommendedServices = [];
          vm.referral.availableServices = RecommendationsService.parseAvailableServices({}, data.items.availableServices);
        }
      });
    }

    /**
     * openServiceEditor
     * @description opens a modal window for the serviceModal service editor
     */
    function openServiceEditor(service) {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'variations-modal-window',
        templateUrl: 'directives/modelEditors/serviceEditor/serviceModal.tpl.html',
        controller: 'ServiceModalController',
        controllerAs: 'svcmodal',
        bindToController: true,
        resolve: {
          Service: function() {
            return angular.copy(service);
          },
          ApprovedServices: function() {
            return angular.copy(vm.referral.approvedServices);
          }
        }
      });

      modalInstance.result.then(function (updatedService) {
        vm.init();
      });
    }
  }

})();
