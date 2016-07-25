(function () {
  'use strict';

  angular
    .module('altum.referral.recommendations', [
      'ui.bootstrap',
      'ngMaterial',
      'ngResource',
      'toastr',
      'dados.header.service',
      'dados.common.services.altum',
      'dados.common.directives.focusIf',
      'altum.referral.recommendationsPicker',
      'altum.referral.serviceDetail'
    ])
    .controller('RecommendationsController', RecommendationsController);

  RecommendationsController.$inject = [
    '$resource', '$location', 'API', 'HeaderService', 'toastr', 'RecommendationsService'
  ];

  function RecommendationsController($resource, $location, API, HeaderService, toastr, RecommendationsService) {
    var vm = this;

    // bindable variables
    vm.url = API.url() + $location.path();
    var Resource = $resource(vm.url);
    var BulkRecommendServices = $resource(API.url('billinggroup/bulkRecommend'), {}, {
      'save' : {method: 'POST', isArray: false}
    });

    // fields that are required in order to make recommendations
    vm.validityFields = ['visitService', 'serviceDate'];

    // configuration object for the service-editor component
    vm.serviceEditorConfig = {
      loadVisitServiceData: true,
      disabled: {
        altumService: true,
        programService: true,
        site: true,
        variations: true,
        serviceDate: true
      },
      required: {
        visitService: true
      }
    };

    vm.serviceOrder = {
      recommendedServices: 2,
      serviceDetail: 1
    };
    vm.accordionStatus = {};
    vm.sharedService = {};
    vm.currIndex = null;
    vm.recommendedServices = [];
    vm.availableServices = [];

    // bindable methods
    vm.saveServices = saveServices;
    vm.isServiceValid = isServiceValid;
    vm.areServicesValid = areServicesValid;
    vm.swapPanelOrder = swapPanelOrder;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      Resource.get(function (data, headers) {
        vm.sharedService = {};
        vm.resource = angular.copy(data);
        vm.referral = angular.copy(data.items);

        // load physician in from referraldetail
        vm.sharedService = {
          referral: data.items.id,
          physician: data.items.physician || null,
          staffCollection: {},
          staff: [],
          workStatus: null,
          prognosis: null,
          prognosisTimeframe: null,
          visitService: null,
          serviceDate: new Date()
        };

        // email fields for sending email from note directive
        vm.emailInfo = {
          template: 'referral',
          data: {
            claim: vm.referral.claimNumber,
            client: vm.referral.client_displayName,
            url: encodeURI($location.absUrl())
          },
          options: {
            subject: 'Altum CMS Communication'
          }
        };

        // load in staff selections from referraldetail
        if (data.items.staff) {
          vm.sharedService.staff = [data.items.staff];
          vm.sharedService.staffCollection[data.items.staffType_name] = [data.items.staff];
        }

        // initialize submenu
        HeaderService.setSubmenu('referral', data.links);

        if (vm.referral.program) {
          vm.recommendedServices = [];
          vm.availableServices = RecommendationsService.parseAvailableServices(vm.sharedService, data.items.availableServices);
        }
      });
    }

    /**
     * saveServices
     * @description Saves the currently selected services to the current referral
     */
    function saveServices() {
      vm.isSaving = true;
      var bulkRecommendServices = new BulkRecommendServices({
        newBillingGroups: _.map(vm.recommendedServices, RecommendationsService.prepareService)
      });

      bulkRecommendServices.$save(function (data) {
        toastr.success('Added services to referral for client: ' + vm.referral.client_displayName, 'Recommendations');
        vm.isSaving = false;
        vm.currIndex = null;
        vm.recommendedServices = [];
        init();
      });
    }

    /**
     * isServiceValid
     * @description Checks if service have the correct prerequisite data before saving
     * @return {Boolean}
     */
    function isServiceValid(service) {
      // for all required fields (see top), return true if each recommended service has non-null field
      return _.all(vm.validityFields, function (field) {
        var isValid = _.has(service, field) && !_.isNull(service[field]);
        // if particular service requires a site selection, ensure it is not null
        if (_.has(service, 'availableSites') && service.availableSites.length) {
          return isValid && !_.isNull(service.site);
        }
        return isValid;
      });
    }

    /**
     * areServicesValid
     * @description Checks if all proposed recommended services have the correct prerequisite data before saving
     * @return {Boolean}
     */
    function areServicesValid() {
      return _.all(vm.recommendedServices, function (recommendedService) {
        return isServiceValid(recommendedService);
      });
    }

    /**
     * swapPanelOrder
     * @description Convenience method for switching order of service panels in the recommended services tab
     */
    function swapPanelOrder() {
      vm.serviceOrder.recommendedServices = vm.serviceOrder.recommendedServices ^ vm.serviceOrder.serviceDetail;
      vm.serviceOrder.serviceDetail = vm.serviceOrder.recommendedServices ^ vm.serviceOrder.serviceDetail;
      vm.serviceOrder.recommendedServices = vm.serviceOrder.recommendedServices ^ vm.serviceOrder.serviceDetail;
    }

  }

})();

