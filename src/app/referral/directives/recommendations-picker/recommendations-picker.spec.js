describe('Controller: RecommendationsPickerController Tests', function () {

  var scope, recCtrl, httpBackend;
  var API, HeaderService, AltumAPI, toastr;

  beforeEach(module('altum.referral.recommendationsPicker'));

  // Angular strips the underscores when injecting
  beforeEach(inject(function (_$controller_, _$httpBackend_, _$rootScope_, $injector) {
    scope = _$rootScope_.$new();
    httpBackend = _$httpBackend_;
    recCtrl = _$controller_('RecommendationsPickerController', {$scope: scope});
    API = $injector.get('API');
    AltumAPI = $injector.get('AltumAPIService');
    toastr = $injector.get('toastr');
    scope.vm = recCtrl;

    recCtrl.availableServices = [
      {
        'serviceCategory': 1,
        'programService': 1,
        'program': 1,
        'serviceVariation': 1,
        'altumServiceName': 'CT Scan',
        'serviceCategoryName': 'Assessment',
        'programServiceName': '[TEST] CT SCAN',
        'hasTelemedicine': false,
        'approvalNeeded': true,
        'approvalRequired': false,
        'programName': '[TEST] WSIB Back and Neck Program'
      }, {
        'serviceCategory': 2,
        'programService': 1,
        'program': 1,
        'serviceVariation': null,
        'altumServiceName': '[TEST] CT SCAN - BACK',
        'serviceCategoryName': 'Diagnosis',
        'programServiceName': '[TEST] CT SCAN',
        'hasTelemedicine': true,
        'approvalNeeded': true,
        'approvalRequired': false,
        'programName': '[TEST] WSIB Back and Neck Program'
      }, {
        'serviceCategory': 2,
        'programService': 1,
        'program': 1,
        'serviceVariation': null,
        'altumServiceName': '[TEST] CT SCAN - HEAD',
        'serviceCategoryName': 'Diagnosis',
        'programServiceName': '[TEST] CT SCAN',
        'hasTelemedicine': false,
        'approvalNeeded': true,
        'approvalRequired': false,
        'programName': '[TEST] WSIB Back and Neck Program'
      }, {
        'serviceCategory': 2,
        'programService': 1,
        'program': 1,
        'serviceVariation': null,
        'altumServiceName': '[TEST] CT SCAN - NECK',
        'serviceCategoryName': 'Diagnosis',
        'programServiceName': '[TEST] CT SCAN',
        'hasTelemedicine': false,
        'approvalNeeded': true,
        'approvalRequired': false,
        'programName': '[TEST] WSIB Back and Neck Program'
      }
    ];
    recCtrl.referral = {
      'program': 1,
      'physician': 1,
      'staff': {
        'displayName': 'Dr. Alexandrine Bayer',
        'id': 1,
        'staffTypeDisplayName': 'Clinician',
        'staffType': 1
      },
      'site': 4,
      'client': 2,
      'id': 1,
      'displayName': 'Mrs. Jadyn Barton',
      'program_name': '[TEST] WSIB Back and Neck Program',
      'physician_name': 'Ms. Shaun Barton',
      'staffType_name': 'Clinician',
      'staff_name': 'Dr. Alexandrine Bayer',
      'site_name': 'Hamilton',
      'statusName': null,
      'client_displayName': 'Mrs. Jadyn Barton',
      'client_address1': '87940 Liliana Meadows',
      'client_address2': 'Apt. 126',
      'client_province': 'Utah',
      'client_postalCode': '16674',
      'client_country': 'Malta',
      'client_latitude': '43.76490',
      'client_longitude': '-79.48599',
      'claimNumber': '657454-KR-PR',
      'policyNumber': null,
      'approvedServices': [
        {
          'id': 5,
          'displayName': '[TEST] CT SCAN - HEAD',
          'altumServiceName': '[TEST] CT SCAN - HEAD',
          'programServiceName': '[TEST] CT SCAN',
          'programName': '[TEST] WSIB Back and Neck Program',
        }
      ]
    };
    recCtrl.service = {
      'physician': 1,
      'staffCollection': {
        'Clinician': [{
          'displayName': 'Dr. Alexandrine Bayer',
          'id': 1,
          'staffTypeDisplayName': 'Clinician',
          'staffType': 1
        }]
      },
      'staff': [{
        'displayName': 'Dr. Alexandrine Bayer',
        'id': 1,
        'staffTypeDisplayName': 'Clinician',
        'staffType': 1
      }],
      'workStatus': null,
      'prognosis': null,
      'prognosisTimeframe': null,
      'visitService': null,
      'serviceDate': '2016-05-13T13:38:07.292Z'
    };
  }));

  describe('Basic unit tests for adding/removing service selections', function () {
    it('should at least be defined', function () {
      expect(recCtrl).toBeDefined();
    });

    it('should add available services to the recommendedServices array', function() {
      recCtrl.toggleService(recCtrl.availableServices[0]);
      recCtrl.toggleService(recCtrl.availableServices[1]);
      expect(recCtrl.recommendedServices.length).toEqual(2);
    });

    it('should un-recommend a service and make it available to be recommended again', function() {
      recCtrl.toggleService(recCtrl.availableServices[0]);
      expect(recCtrl.recommendedServices.length).toEqual(1);
    });

  });

  describe('Detail selection for recommended services', function () {

    it('should not be available if not all fields have been selected', function() {
      // adds all available services to recommended
      recCtrl.availableServices.map(function (availableService) {
        recCtrl.toggleService(availableService);
      });

      expect(recCtrl.recommendedServices.length).toEqual(4);
    });

  });
});
