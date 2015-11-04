(function () {
    'use strict';
    angular
        .module('dados.altum_api.constants', ['dados.constants'])
        .service('ALTUM_API_API', Altum_API)
      .service('PROGRAM_API', Program)
      .service('REFERRAL_API', Referral)
      .service('REFERRALDETAIL_API', ReferralDetail)
      .service('ADDRESS_API', Address)
      .service('PHYSICIAN_API', Address)
      .service('SITE_API', Site);

    Program.$inject = ['API'];
  Address.$inject = ['API'];
  Referral.$inject = ['API'];
  Site.$inject = ['API'];
  Physician.$inject = ['API'];

  function Altum_API(API) {
    return {url: API.url() + '/altum_api/:id'};
  }
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
})();
