describe('Controller: RecommendationsController Tests', function() {

  var scope, recCtrl, httpBackend;
  var API, HeaderService, AltumAPI, toastr;

  beforeEach(module('altum.referral.recommendations'));

  // Angular strips the underscores when injecting
  beforeEach(inject(function (_$controller_, _$httpBackend_, _$rootScope_, $injector, $location) {
    scope = _$rootScope_.$new();
    httpBackend = _$httpBackend_;
    spyOn($location, 'path').and.returnValue('/referral/1/recommendations');
    recCtrl = _$controller_('RecommendationsController', {$scope: scope});
    API = $injector.get('API');
    HeaderService = $injector.get('HeaderService');
    AltumAPI = $injector.get('AltumAPIService');
    toastr = $injector.get('toastr');
    scope.vm = recCtrl;
    httpBackend.whenGET('http://localhost:1337/api/referral/1/recommendations').respond({
      'version': '1.0',
      'href': 'http://localhost:1337/api/referral',
      'referrer': 'http://localhost:1337/api/referral/1',
      'items': {
        'client': 2,
        'claim': 6,
        'site': 9,
        'program': 6,
        'claimNumber': 123,
        'client_displayName': 'Mr Test Subject',
        'availableServices': [
          {
            'serviceCategory': 2,
            'programService': 1,
            'program': 6,
            'id': 1,
            'altumServiceName': '[TEST] CT SCAN - HEAD',
            'serviceCategoryName': 'Diagnosis',
            'programServiceName': '[TEST] CT SCAN',
            'programName': '[TEST] WSIB Back and Neck Program',
            'sites': []
          },
          {
            'serviceCategory': 2,
            'programService': 1,
            'program': 6,
            'id': 2,
            'altumServiceName': '[TEST] CT SCAN - NECK',
            'serviceCategoryName': 'Diagnosis',
            'programServiceName': '[TEST] CT SCAN',
            'programName': '[TEST] WSIB Back and Neck Program',
            'sites': []
          },
          {
            'serviceCategory': 2,
            'programService': 1,
            'program': 6,
            'id': 3,
            'altumServiceName': '[TEST] CT SCAN - BACK',
            'serviceCategoryName': 'Diagnosis',
            'programServiceName': '[TEST] CT SCAN',
            'programName': '[TEST] WSIB Back and Neck Program',
            'sites': []
          },
          {
            'serviceCategory': 1,
            'programService': 2,
            'program': 6,
            'id': 5,
            'altumServiceName': 'Neck Assessment',
            'serviceCategoryName': 'Assessment',
            'programServiceName': 'Assessment',
            'programName': '[TEST] WSIB Back and Neck Program',
            'sites': []
          },
          {
            'serviceCategory': 3,
            'programService': 3,
            'program': 6,
            'id': 6,
            'altumServiceName': 'Interpreter - Spanish',
            'serviceCategoryName': 'Facilitation',
            'programServiceName': 'Interpreter',
            'programName': '[TEST] WSIB Back and Neck Program',
            'sites': []
          },
          {
            'serviceCategory': 1,
            'programService': 2,
            'program': 6,
            'id': 4,
            'altumServiceName': 'Back Assessment',
            'serviceCategoryName': 'Assessment',
            'programServiceName': 'Assessment',
            'programName': '[TEST] WSIB Back and Neck Program',
            'sites': [
             {
              'altumServices': [],
              'siteServices': [],
              'siteStaff': [],
              'displayName': 'TWH',
              'name': 'TWH',
              'id': 1,
              'address': 1
            },
             {
              'altumServices': [],
              'siteServices': [],
              'siteStaff': [],
              'displayName': 'Hamilton',
              'name': 'Hamilton',
              'id': 3,
              'address': 3
            },
             {
              'altumServices': [],
              'siteServices': [],
              'siteStaff': [],
              'displayName': 'Barrie',
              'name': 'Barrie',
              'id': 8,
              'address': 8
            },
             {
              'altumServices': [],
              'siteServices': [],
              'siteStaff': [],
              'displayName': 'Ajax',
              'name': 'Ajax',
              'id': 9,
              'address': 9
            }
           ]
          },
          {
            'serviceCategory': 3,
            'programService': 3,
            'program': 6,
            'id': 7,
            'altumServiceName': 'Interpreter - Chinese',
            'serviceCategoryName': 'Facilitation',
            'programServiceName': 'Interpreter',
            'programName': '[TEST] WSIB Back and Neck Program',
            'sites': [
             {
              'altumServices': [],
              'siteServices': [],
              'siteStaff': [],
              'displayName': 'Hamilton',
              'name': 'Hamilton',
              'phone': null,
              'id': 3,
              'address': 3
            },
             {
              'altumServices': [],
              'siteServices': [],
              'siteStaff': [],
              'displayName': 'Sudbury',
              'name': 'Sudbury',
              'id': 6,
              'address': 6
            },
             {
              'altumServices': [],
              'siteServices': [],
              'siteStaff': [],
              'displayName': 'Barrie',
              'name': 'Barrie',
              'id': 8,
              'address': 8
            }
           ]
          }
        ],
        'displayName': 'No Display Name',
        'referralDate': '2015-03-09T00:00:00.000Z',
        'clinicDate': '2015-03-17T00:00:00.000Z',
        'accidentDate': '2016-01-23T10:07:12.000Z',
        'receiveDate': '2015-04-14T08:20:30.000Z',
        'sentDate': '2015-03-23T15:04:13.000Z',
        'dischargeDate': '2015-10-14T17:43:47.000Z',
        'recommendationsMade': false,
        'id': 1
      },
      'path': '/api/referral',
      'queries': [],
      'total': 5
    });
    httpBackend.whenGET('http://localhost:1337/api/prognosis').respond();
    httpBackend.whenGET('http://localhost:1337/api/timeframe').respond();
    httpBackend.whenGET('http://localhost:1337/api/servicetype').respond();
    httpBackend.whenGET('http://localhost:1337/api/staffType').respond();
    httpBackend.whenGET('http://localhost:1337/api/note?referral=1').respond();
    httpBackend.whenGET('http://localhost:1337/api/note?where=%7B%22referral%22:1%7D').respond();
    httpBackend.whenGET('http://localhost:1337/api/staffType?where=%7B%22isProvider%22:true%7D').respond();

    httpBackend.flush();
  }));

  describe('Basic unit tests for adding/removing service selections', function() {
    it('should at least be defined', function() {
      expect(recCtrl).toBeDefined();
    });

    it('should return unique all available altum services for a given program', function() {
      expect(recCtrl.availableServices.length).toEqual(7);
      recCtrl.availableServices.map(function (availableService) {
        expect(availableService.name).not.toBeNull();
        expect(availableService.altumService).not.toBeNull();
        expect(availableService.programService).not.toBeNull();
        expect(availableService.serviceCategory).not.toBeNull();
        expect(availableService.approvalNeeded).toBeFalsy();
      });
    });

    it('should apply selection to all recommended services for shared services', function() {
      recCtrl.sharedService.physician = 1;
      _.each(recCtrl.recommendedServices, function (service) {
        expect(service.physician).toEqual(1);
      });
    });

    it('should apply staff selection to all recommended services for shared services', function () {
      recCtrl.sharedService.staffCollection = {
        'Clinician': [1, 2]
      };
      _.each(recCtrl.recommendedServices, function (service) {
        expect(service.staff).toEqual([1, 2]);
      });
    });

  });

  describe('Detail selection for recommended services', function() {

    it('should apply to all recommended services when selections are made in detail panel', function() {
      expect(recCtrl.validityFields.length).toEqual(2);

      recCtrl.recommendedServices.forEach(function (recommendedService) {
        recCtrl.validityFields.forEach(function (field) {
          expect(recommendedService[field]).not.toBeNull();
        });
      });
    });

    it('should be available when all fields selected and services with sites selected', function() {
      recCtrl.recommendedServices.forEach(function (recommendedService) {
        if (recommendedService.availableSites.length) {
          recommendedService.site = recommendedService.sites[0].id;
        }
      });
      expect(recCtrl.areServicesValid()).toBeTruthy();
    });

  });
});
