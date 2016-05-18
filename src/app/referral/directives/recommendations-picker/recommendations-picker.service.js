(function() {
  'use strict';

  angular
    .module('altum.referral.recommendationsPicker')
    .constant('FIELDS', [
      'physician', 'staff', 'staffCollection', 'workStatus', 'prognosis',
      'prognosisTimeframe', 'visitService', 'serviceDate',
      'name', 'altumService', 'programService', 'serviceCategory', 'serviceCategoryName',
      'serviceDate', 'serviceVariation', 'site', 'hasTelemedicine', 'approvalNeeded', 'approvalRequired'
    ])
    .constant('CONFIG_FIELDS', [
      'availableSites', 'availableStaffTypes', 'siteDictionary',
      'staffCollection', 'serviceVariation', 'variationSelection'
    ])
    .service('RecommendationsService', RecommendationsService);

  RecommendationsService.$inject = ['FIELDS', 'CONFIG_FIELDS'];

  function RecommendationsService(FIELDS, CONFIG_FIELDS) {
    var service = {
      isValidFormat: isValidFormat,
      prepareService: prepareService,
      getSharedServices: getSharedServices,
      parseAvailableServices: parseAvailableServices
    };

    return service;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * isValidFormat
     * @description Returns true if given available services array is already in valid format
     * @param availableServices
     * @returns {boolean}
     */
    function isValidFormat(availableServices) {
      return _.all(availableServices, function (service) {
        return _.all(FIELDS, function (field) {
          return _.has(service, field);
        });
      });
    }

    /**
     * prepareService
     * @description Utility function for preparing service objects prior to being POSTed to the server
     * @param service
     */
    function prepareService(service) {
      // for recommended services that have variations selected, apply to object to be sent to server
      if (_.has(service, 'serviceVariation') && _.has(service, 'variationSelection')) {
        _.each(service.variationSelection.changes, function (value, key) {
          switch (key) {
            case 'service':
              service.altumService = service.variationSelection.altumService;
              service.programService = service.variationSelection.programService;
              service.name = service.variationSelection.name;
              break;
            case 'followup':
              service.followupPhysicianDetail = service.variationSelection.changes[key].value.physician;
              service.followupTimeframeDetail = service.variationSelection.changes[key].value.timeframe;
              break;
            default:
              // otherwise, variation is of type number/text/date/physician/staff/timeframe/measure
              // where the respective backend column name will be <type>DetailName and value will be <type>Detail
              service[key + 'DetailName'] = service.variationSelection.changes[key].name;
              service[key + 'Detail'] = service.variationSelection.changes[key].value;
              break;
          }
        });
      }

      // clear fields that are used during configuration of recommended services that will be deleted before POSTing
      _.each(CONFIG_FIELDS, function (field) {
        delete service[field];
      });

      return service;
    }

    /**
     * getSharedServices
     * @description Returns shared service data for all prospective recommended services
     * @param sharedService
     * @returns {Object}
     */
    function getSharedServices(sharedService) {
      return {
        physician: sharedService.physician || null,
        staff: sharedService.staff || null,
        staffCollection: sharedService.staffCollection || {},
        workStatus: sharedService.workStatus || null,
        prognosis: sharedService.prognosis || null,
        prognosisTimeframe: sharedService.prognosisTimeframe || null,
        visitService: sharedService.visitService || null,
        serviceDate: sharedService.serviceDate || new Date()
      };
    }

    /**
     * parseAvailableServices
     * @description Fetches the available list of services to an empty set of the referral's programs's available services
     */
    function parseAvailableServices(sharedService, altumProgramServices) {
      if (isValidFormat(altumProgramServices)) {
        return altumProgramServices;
      } else {
        // available services denote all program services across each retrieved altum service
        // sorting respective program services by serviceCateogry takes place in the html template
        return _.map(altumProgramServices, function (altumProgramService) {
          // append each altumProgramService's altumProgramServices to the list of available prospective services
          return _.merge(getSharedServices(sharedService), {
            name: altumProgramService.altumServiceName,
            altumService: altumProgramService.id,
            programService: altumProgramService.programService,
            programServiceName: altumProgramService.programServiceName,
            programServiceCode: altumProgramService.programServiceCode,
            serviceCategory: altumProgramService.serviceCategory,
            serviceCategoryName: altumProgramService.serviceCategoryName,
            serviceDate: new Date(),
            serviceVariation: altumProgramService.serviceVariation,
            site: null,
            hasTelemedicine: altumProgramService.hasTelemedicine,
            approvalNeeded: altumProgramService.approvalNeeded,
            approvalRequired: altumProgramService.approvalRequired
          });
        });
      }
    }
  }

})();
