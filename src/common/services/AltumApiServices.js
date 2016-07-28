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
    .service('ServiceVariationService', ServiceVariationService)
    .service('ServiceCategoryService', ServiceCategoryService)
    .service('ServiceService', ServiceService)
    .service('CompanyService', CompanyService)
    .service('EmployeeService', EmployeeService)
    .service('BillingGroupService', BillingGroupService)
    .service('StatusFormService', StatusFormService)
    .service('StaffService', StaffService)
    .service('StaffTypeService', StaffTypeService)
    .service('NoteService', NoteService)
    .service('NoteTypeService', NoteTypeService)
    .service('ClientService', ClientService)
    .service('PersonService', PersonService);

  [
    ProgramService, ReferralService, ReferralDetailService, SiteService, AddressService,
    PhysicianService, PayorService, WorkStatusService, PrognosisService, ProgramServiceService,
    AltumServiceService, AltumProgramServices, ServiceVariationService, ServiceCategoryService,
    AltumAPIService, BillingGroupService, ServiceService, NoteService, NoteTypeService, ClientService, PersonService, EmergencyContactService,
    CityService, PhysicianService, PayorService, StatusService, WorkStatusService, PrognosisService, TimeframeService,
    ProgramServiceService, AltumServiceService, AltumProgramServices, ServiceCategoryService, CompanyService, EmployeeService,
    AltumAPIService, ServiceService, StatusFormService, StaffService, StaffTypeService, NoteService, NoteTypeService
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
    return ResourceFactory.create(API.url('status'), {cache: true});
  }

  function WorkStatusService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('workstatus'), {cache: true});
  }

  function PrognosisService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('prognosis'), {cache: true});
  }

  function TimeframeService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('timeframe'), {cache: true});
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

  function ServiceVariationService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('servicevariation'));
  }

  function ServiceCategoryService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('servicecategory'));
  }

  function BillingGroupService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('billinggroup'));
  }

  function ServiceService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('service'));
  }

  function StatusFormService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('statusform'));
  }

  function StaffService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('staff'));
  }

  function StaffTypeService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('stafftype'), {cache: true});
  }

  function NoteService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('note'));
  }

  function NoteTypeService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('notetype'), {cache: true});
  }

  function ClientService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('client'));
  }

  function PersonService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('person'));
  }

  function EmergencyContactService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('emergencyContact'));
  }

  function CityService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('city'));
  }

  function CompanyService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('company'));
  }

  function EmployeeService(ResourceFactory, API) {
    return ResourceFactory.create(API.url('employee'));
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
      'Status': ResourceFactory.create(API.url('status'), {cache: true}),
      'WorkStatus': ResourceFactory.create(API.url('workstatus'), {cache: true}),
      'Prognosis': ResourceFactory.create(API.url('prognosis'), {cache: true}),
      'Timeframe': ResourceFactory.create(API.url('timeframe'), {cache: true}),
      'ProgramService': ResourceFactory.create(API.url('programservice')),
      'AltumService': ResourceFactory.create(API.url('altumservice')),
      'AltumProgramServices': ResourceFactory.create(API.url('altumprogramservices')),
      'ServiceVariation': ResourceFactory.create(API.url('servicevariation')),
      'ServiceCategory': ResourceFactory.create(API.url('servicecategory')),
      'BillingGroup': ResourceFactory.create(API.url('billinggroup')),
      'Service': ResourceFactory.create(API.url('service')),
      'StatusForm' : ResourceFactory.create(API.url('statusform')),
      'Staff' : ResourceFactory.create(API.url('staff')),
      'StaffType' : ResourceFactory.create(API.url('staffType'), {cache: true}),
      'Note' : ResourceFactory.create(API.url('note')),
      'NoteType' : ResourceFactory.create(API.url('noteType'), {cache: true}),
      'Client': ResourceFactory.create(API.url('client')),
      'Person': ResourceFactory.create(API.url('person')),
      'EmergencyContact': ResourceFactory.create(API.url('emergencyContact')),
      'City': ResourceFactory.create(API.url('city')),
      'Company': ResourceFactory.create(API.url('company')),
      'Employee': ResourceFactory.create(API.url('employee'))
    };
  }
})();
