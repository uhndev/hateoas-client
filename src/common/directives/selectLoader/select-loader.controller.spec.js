describe('Controller: SelectController Tests', function() {

  var scope, selCtrl, httpBackend, mockSocket, API;

  beforeEach(module('dados.common.directives.selectLoader.controller'));

  // Angular strips the underscores when injecting
  beforeEach(inject(function (_$controller_, _$httpBackend_, _$rootScope_, _$sailsSocket_, $injector) {
    scope = _$rootScope_.$new();
    httpBackend = _$httpBackend_;
    mockSocket = _$sailsSocket_;
    API = $injector.get('API');
    selCtrl = _$controller_('SelectController', {$scope: scope});
    spyOn(mockSocket, 'get').and.returnValue({
      data: {
        items: [
          {
            'displayName': 'Mr. Admin User',
            'username': 'admin',
            'email': 'admin@example.com',
            'id': 1,
            'prefix': 'Mr.',
            'firstname': 'Admin',
            'lastname': 'User'
          },
          {
            'displayName': 'Mr. John Doe',
            'username': 'johndoe',
            'email': 'johndoe@email.com',
            'id': 2,
            'prefix': 'Mr.',
            'firstname': 'John',
            'lastname': 'Doe'
          },
          {
            'displayName': 'Ms. Jane Doe',
            'username': 'janedoe',
            'email': 'janedoe@email.com',
            'id': 3,
            'prefix': 'Ms.',
            'firstname': 'Jane',
            'lastname': 'Doe'
          },
          {
            'displayName': 'Mr. Kevin Chan',
            'username': 'khchan',
            'email': 'khchan@email.com',
            'id': 4,
            'prefix': 'Mr.',
            'firstname': 'Kevin',
            'lastname': 'Chan'
          }
        ]
      }
    });

    scope.vm = selCtrl;
  }));

  describe('Basic unit tests for loading/parsing values for input', function() {
    it('should at least be defined', function () {
      expect(selCtrl).toBeDefined();
    });

    it('should parse atomic objects to id numbers', function() {
      selCtrl.isAtomic = true;
      expect(selCtrl.parseValues({name: 'test', id: 1})).toEqual(1);
    });

    it('should leave atomic ids as is', function() {
      selCtrl.isAtomic = true;
      expect(selCtrl.parseValues(2)).toEqual(2);
    });

    it('should parse non-atomic collections to arrays of ids', function() {
      selCtrl.isAtomic = false;
      expect(selCtrl.parseValues([{name: 'test', id: 1}, {name: 'test2', id: 2}])).toEqual([1, 2]);
    });

    it('should leave non-atomic array ids as is', function() {
      selCtrl.isAtomic = false;
      expect(selCtrl.parseValues([1, 2])).toEqual([1, 2]);
    });
  });

});
