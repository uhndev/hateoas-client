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
    .service('SiteService', SiteService);

  Altum_APIService.$inject = ['ResourceFactory','ALTUM_API_API'];
  ProgramService.$inject = ['ResourceFactory','PROGRAM_API'];
  ReferralService.$inject = ['ResourceFactory','REFERRAL_API'];
  ReferralDetailService.$inject = ['ResourceFactory','REFERRALDETAIL_API'];
  AddressService.$inject = ['ResourceFactory','ADDRESS_API'];
  SiteService.$inject = ['ResourceFactory','SITE_API'];
  PhysicianService.$inject = ['ResourceFactory','PHYSICIAN_API'];
  PayorService.$inject = ['ResourceFactory','PAYOR_API'];
  WorkStatusService.$inject = ['ResourceFactory','WORKSTATUS_API'];
  PrognosisService.$inject = ['ResourceFactory','PROGNOSIS_API'];

  function Altum_APIService(ResourceFactory,ALTUM_API_API) {
    return ResourceFactory.create(ALTUM_API_API.url);
  }
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
})();
