(function () {
    'use strict';
    angular
        .module('dados.altum_api.constants', ['dados.constants'])
      .service('PROGRAM_API', Program)
      .service('REFERRAL_API', Referral)
      .service('REFERRALDETAIL_API', ReferralDetail)
      .service('ADDRESS_API', Address)
      .service('PHYSICIAN_API', Address)
      .service('PAYOR_API', Payor)
      .service('WORKSTATUS_API', WorkStatus)
      .service('PROGNOSIS_API', Prognosis)
      .service('ALTUMPROGRAMSERVICES_API', AltumProgramServices )
      .service('SITE_API', Site);

  Program.$inject = ['API'];
  Address.$inject = ['API'];
  Referral.$inject = ['API'];
  Site.$inject = ['API'];
  Physician.$inject = ['API'];
  Payor.$inject = ['API'];
  WorkStatus.$inject = ['API'];
  Prognosis.$inject = ['API'];
  AltumProgramServices.$inject = ['API'];

  function Program(API) {
    return {url: API.url() + '/program/:id'};
  }
  function Referral(API) {
    return {url: API.url() + '/referral/:id'};
  }

  function ReferralDetail(API) {
    return {url: API.url() + '/referraldetail/:id'};
  }

  function Site(API) {
    return {url: API.url() + '/site/:id'};
  }

  function Address(API) {
    return {url: API.url() + '/address/:id'};
  }
  function Physician(API) {
    return {url: API.url() + '/physician/:id'};
  }
  function Payor(API) {
    return {url: API.url() + '/payor/:id'};
  }
  function WorkStatus(API) {
    return {url: API.url() + '/workstatus/:id'};
  }
  function Prognosis(API) {
    return {url: API.url() + '/prognosis/:id'};
  }
  function AltumProgramServices(API) {
    return {url: API.url() + '/altumprogramservices/:id'};
  }
})();
