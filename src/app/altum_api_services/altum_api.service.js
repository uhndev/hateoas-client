/**
 * Data service for handling all Assessmententication data
 */
(function() {
  'use strict';

  angular
    .module('dados.arm.altum_api.service',
      [
          'dados.altum_api.constants',
          'dados.common.services.resource'
      ])
      .service('ProgramService', ProgramService)
    .service('ReferralService', ReferralService)
    .service('ReferralDetailService', ReferralDetailService)
    .service('AddressService', AddressService)
    .service('PhysicianService', PhysicianService)
    .service('PayorService', PayorService)
    .service('WorkStatusService', WorkStatusService)
    .service('PrognosisService', PrognosisService)
    .service('AltumAPIService', AltumAPIService)
    .service('AltumProgramServicesService', AltumProgramServicesService)
    .service('SiteService', SiteService);

  AltumAPIService.$inject = ['ResourceFactory', 'ALTUMPROGRAMSERVICES_API','PROGNOSIS_API'];
  ProgramService.$inject = ['ResourceFactory','PROGRAM_API'];
  ReferralService.$inject = ['ResourceFactory','REFERRAL_API'];
  ReferralDetailService.$inject = ['ResourceFactory','REFERRALDETAIL_API'];
  AddressService.$inject = ['ResourceFactory','ADDRESS_API'];
  SiteService.$inject = ['ResourceFactory','SITE_API'];
  PhysicianService.$inject = ['ResourceFactory','PHYSICIAN_API'];
  PayorService.$inject = ['ResourceFactory','PAYOR_API'];
  WorkStatusService.$inject = ['ResourceFactory','WORKSTATUS_API'];
  PrognosisService.$inject = ['ResourceFactory','PROGNOSIS_API'];
  AltumProgramServicesService.$inject = ['ResourceFactory','ALTUMPROGRAMSERVICES_API'];

  function ProgramService(ResourceFactory,PROGRAM_API) {
    return ResourceFactory.create(PROGRAM_API.url);
  }
  function ReferralService(ResourceFactory,REFERRAL_API) {
    return ResourceFactory.create(REFERRAL_API.url);
  }
  function ReferralDetailService(ResourceFactory,REFERRALDETAIL_API) {
    return ResourceFactory.create(REFERRALDETAIL_API.url);
  }
  function SiteService(ResourceFactory,SITE_API) {
    return ResourceFactory.create(SITE_API.url);
  }
  function AddressService(ResourceFactory,ADDRESS_API) {
    return ResourceFactory.create(ADDRESS_API.url);
  }
  function PhysicianService(ResourceFactory,PHYSICIAN_API) {
    return ResourceFactory.create(PHYSICIAN_API.url);
  }
  function PayorService(ResourceFactory,PAYOR_API) {
    return ResourceFactory.create(PAYOR_API.url);
  }
  function WorkStatusService(ResourceFactory,WORKSTATUS_API) {
    return ResourceFactory.create(WORKSTATUS_API.url);
  }
  function PrognosisService(ResourceFactory,PROGNOSIS_API) {
    return ResourceFactory.create(PROGNOSIS_API.url);
  }
  function AltumProgramServicesService(ResourceFactory,ALTUMPROGRAMSERVICES_API) {
    return ResourceFactory.create(ALTUMPROGRAMSERVICES_API.url);
  }
  function AltumAPIService(ResourceFactory, PROGRAM_API, REFERRAL_API,REFERRALDETAIL_API,SITE_API,ADDRESS_API,PHYSICIAN_API,PAYOR_API,WORKSTATUS_API,ALTUMPROGRAMSERVICES_API, PROGNOSIS_API ) {
      return {
        'ProgramService' : ResourceFactory.create(PROGRAM_API.url),
        'ReferralService' : ResourceFactory.create(REFERRAL_API.url),
        'ReferralDetailService' : ResourceFactory.create(REFERRALDETAIL_API.url),
        'SiteService' : ResourceFactory.create(SITE_API.url),
        'AddressService' : ResourceFactory.create(ADDRESS_API.url),
        'PhysicianService' : ResourceFactory.create(PHYSICIAN_API.url),
        'PayorService' : ResourceFactory.create(PAYOR_API.url),
        'WorkStatusService' : ResourceFactory.create(WORKSTATUS_API.url),
        'PrognosisService' : ResourceFactory.create(PROGNOSIS_API.url),
        'AltumProgramServicesService' : ResourceFactory.create(ALTUMPROGRAMSERVICES_API.url)
      };
  }
})();
