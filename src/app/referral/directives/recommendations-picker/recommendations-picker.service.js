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
    .service('RecommendationsService', RecommendationsService);

  RecommendationsService.$inject = ['FIELDS'];

  function RecommendationsService(FIELDS) {
    var service = {
      isValidFormat: isValidFormat,
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
        serviceDate: sharedService.serviceDate || null
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
