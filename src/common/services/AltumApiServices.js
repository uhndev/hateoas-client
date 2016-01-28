/**
 * Data service for handling all Altum angular resources
 */
(function () {
  'use strict';

  angular
    .module('dados.common.services.altum', [
      'dados.constants',
      'dados.common.services.resource'
    ])
    .service('ProgramService', ProgramService)
    .service('ReferralService', ReferralService)
    .service('ReferralDetailService', ReferralDetailService)
    .service('SiteService', SiteService)
    .service('AddressService', AddressService)
    .service('PhysicianService', PhysicianService)
    .service('PayorService', PayorService)
    .service('WorkStatusService', WorkStatusService)
    .service('PrognosisService', PrognosisService)
    .service('AltumAPIService', AltumAPIService)
    .service('ProgramServiceService', ProgramServiceService)
    .service('AltumServiceService', AltumServiceService)
    .service('ServiceService', ServiceService)
    .service('NoteService', NoteService)
    .service('NoteTypeService', NoteTypeService);

  [
    ProgramService, ReferralService, ReferralDetailService, SiteService, AddressService,
    PhysicianService, PayorService, WorkStatusService, PrognosisService, ProgramServiceService,
    AltumServiceService, AltumAPIService, ServiceService, NoteService, NoteTypeService
  ].map(function (service) {
    service.$inject = ['ResourceFactory', 'API'];
  });

  function ProgramService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('program'));
  }

  function ReferralService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('referral'));
  }

  function ReferralDetailService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('referraldetail'));
  }

  function SiteService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('site'));
  }

  function AddressService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('address'));
  }

  function PhysicianService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('physician'));
  }

  function PayorService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('payor'));
  }

  function WorkStatusService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('workstatus'));
  }

  function PrognosisService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('prognosis'));
  }

  function ProgramServiceService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('programservice'));
  }

  function AltumServiceService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('altumservice'));
  }

  function ServiceService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('service'));
  }

  function NoteService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('note'));
  }

  function NoteTypeService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('notetype'));
  }

  function AltumAPIService(ResourceFactory, API) {
    return {
      'Program': ResourceFactory.create(API.url('program')),
      'Referral': ResourceFactory.create(API.url('referral')),
      'ReferralDetail': ResourceFactory.create(API.url('referraldetail')),
      'Site': ResourceFactory.create(API.url('site')),
      'Address': ResourceFactory.create(API.url('address')),
      'Physician': ResourceFactory.create(API.url('physician')),
      'Payor': ResourceFactory.create(API.url('payor')),
      'WorkStatus': ResourceFactory.create(API.url('workstatus')),
      'Prognosis': ResourceFactory.create(API.url('prognosis')),
      'ProgramService': ResourceFactory.create(API.url('programservice')),
      'AltumService': ResourceFactory.create(API.url('altumservice')),
      'Service': ResourceFactory.create(API.url('service')),
      'Note' : ResourceFactory.create(API.url('note')),
      'NoteType' : ResourceFactory.create(API.url('noteType'))
    };
  }
})();
