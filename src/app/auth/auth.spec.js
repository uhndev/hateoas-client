describe('AuthService', function() {
  var AuthService;
  var $httpBackend;
  var $cookies;
  var API;

  beforeEach(function() {
    module('dados.auth.service');
  });

  beforeEach(inject(function($injector) {
    API = $injector.get('API');
    $httpBackend = $injector.get('$httpBackend');
    $cookies = $injector.get('$cookies');
    AuthService = $injector.get('AuthService');
  }));

  afterEach(function() {
    $cookies.remove('user');
  });

  describe('Auth', function() {
    describe('instantiate', function() {
      it('should have isAuthenticated function', function() {
        expect(AuthService.isAuthenticated).toBeDefined();
        expect(angular.isFunction(AuthService.isAuthenticated)).toBeTruthy();
      });

      it('should have login function', function() {
        expect(AuthService.login).toBeDefined();
        expect(angular.isFunction(AuthService.login)).toBeTruthy();
      });

      it('should have logout function', function() {
        expect(AuthService.logout).toBeDefined();
        expect(angular.isFunction(AuthService.logout)).toBeTruthy();
      });
    });

    describe('isAuthenticated', function() {
      it('should return false when user not logged in', function() {
        expect(AuthService.isAuthenticated()).toBeFalsy();
      });

      it('should return true when user is logged in', function() {
        $cookies.putObject('user', {user: 'some value',group:'admin'});
        AuthService.currentGroup = {tabview: {}, name: 'admin'};
        expect(AuthService.isAuthenticated()).toBeTruthy();
        $cookies.remove('user');
      });
    });

    describe('login', function() {
      it('should make a request and invoke callback', function() {
        var invoked = false;
        var success = function() {
          invoked = true;
        };
        var error = function() {};
        $httpBackend.expectPOST(API.base() + '/auth/local').respond();
        AuthService.login({}, success, error);
        $httpBackend.flush();
        expect(invoked).toBeTruthy();
      });

      it('should save the user token as a cookie', function() {
        var success = function() {
          $cookies.put('user', {'user': 'bar', group:'admin'});
        };
        var error = function() {};
        $httpBackend.expectPOST(API.base() + '/auth/local').respond();
        AuthService.login({}, success, error);
        $httpBackend.flush();
        expect($cookies.get('user')).toBeDefined();
      });
    });

    /*describe('logout', function() {
      it('should make a request and invoke callback', function() {
        var success = function() {};
        var error = function() {};
        $httpBackend.expectGET(API.base() + '/logout').respond();
        AuthService.logout(success, error);
        $httpBackend.flush();
        expect($cookies.get('user')).toBeUndefined();
      });
    });*/
  });
});
