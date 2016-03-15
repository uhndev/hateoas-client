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
    .service('StatusService', StatusService)
    .service('WorkStatusService', WorkStatusService)
    .service('PrognosisService', PrognosisService)
    .service('TimeframeService', TimeframeService)
    .service('AltumAPIService', AltumAPIService)
    .service('ProgramServiceService', ProgramServiceService)
    .service('AltumServiceService', AltumServiceService)
    .service('AltumProgramServices', AltumProgramServices)
    .service('ServiceCategoryService', ServiceCategoryService)
    .service('ServiceTypeService', ServiceTypeService)
    .service('ServiceService', ServiceService)
    .service('StaffService', StaffService)
    .service('StaffTypeService', StaffTypeService)
    .service('NoteService', NoteService)
    .service('NoteTypeService', NoteTypeService)
    .service('ClientService', ClientService)
    .service('PersonService', PersonService);

  [
    ProgramService, ReferralService, ReferralDetailService, SiteService, AddressService,
    PhysicianService, PayorService, WorkStatusService, PrognosisService, ProgramServiceService,
    AltumServiceService, AltumProgramServices, ServiceCategoryService, AltumAPIService, ServiceService,
    NoteService, NoteTypeService, ClientService, PersonService,
    PhysicianService, PayorService, StatusService, WorkStatusService, PrognosisService, TimeframeService,
    ProgramServiceService, AltumServiceService, AltumProgramServices, ServiceCategoryService,
    ServiceTypeService, AltumAPIService, ServiceService, StaffService, StaffTypeService, NoteService, NoteTypeService
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

  function StatusService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('status'));
  }

  function WorkStatusService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('workstatus'));
  }

  function PrognosisService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('prognosis'));
  }

  function TimeframeService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('timeframe'));
  }

  function ProgramServiceService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('programservice'));
  }

  function AltumServiceService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('altumservice'));
  }

  function AltumProgramServices(ResourceFactory, API) {
    return ResourceFactory.create(API.url('altumprogramservices'));
  }

  function ServiceCategoryService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('servicecategory'));
  }

  function ServiceTypeService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('servicetype'));
  }

  function ServiceService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('service'));
  }

  function StaffService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('staff'));
  }

  function StaffTypeService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('stafftype'));
  }

  function NoteService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('note'));
  }

  function NoteTypeService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('notetype'));
  }

  function ClientService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('client'));
  }

  function PersonService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('person'));
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
      'Status': ResourceFactory.create(API.url('status')),
      'WorkStatus': ResourceFactory.create(API.url('workstatus')),
      'Prognosis': ResourceFactory.create(API.url('prognosis')),
      'Timeframe': ResourceFactory.create(API.url('timeframe')),
      'ProgramService': ResourceFactory.create(API.url('programservice')),
      'AltumService': ResourceFactory.create(API.url('altumservice')),
      'AltumProgramServices': ResourceFactory.create(API.url('altumprogramservices')),
      'ServiceCategory': ResourceFactory.create(API.url('servicecategory')),
      'ServiceType': ResourceFactory.create(API.url('servicetype')),
      'Service': ResourceFactory.create(API.url('service')),
      'Staff' : ResourceFactory.create(API.url('staff')),
      'StaffType' : ResourceFactory.create(API.url('staffType')),
      'Note' : ResourceFactory.create(API.url('note')),
      'NoteType' : ResourceFactory.create(API.url('noteType')),
      'Client': ResourceFactory.create(API.url('client')),
      'Person': ResourceFactory.create(API.url('person'))
    };
  }
})();
