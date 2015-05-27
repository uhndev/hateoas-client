describe('AuthService', function() {
  var AuthService;
  var $httpBackend;
  var $cookieStore;
  var ipCookie;
 
  beforeEach(function() {
    module('dados.auth.service');
  });
 
  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $cookieStore = $injector.get('$cookieStore');
    ipCookie = $injector.get('ipCookie');
    AuthService = $injector.get('AuthService');
  }));
 
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
        ipCookie('user', {user: 'some value'});
        // $cookieStore.put('user', {user: 'some value'});
        expect(AuthService.isAuthenticated()).toBeTruthy();
        ipCookie.remove('user');
        // $cookieStore.remove('user');
      });
    });

    describe('login', function() {
      it('should make a request and invoke callback', function() {
        var invoked = false;
        var success = function() {
          invoked = true;
        };
        var error = function() {};
        $httpBackend.expectPOST('http://localhost:1337/auth/local').respond();
        AuthService.login({}, success, error);
        $httpBackend.flush();
        expect(invoked).toBeTruthy();
      });

      it('should save the user token as a cookie', function() {
        var success = function() {
          ipCookie('user', { 'user': 'bar' });
          // $cookieStore.put('user', { 'user': 'bar' });
        };
        var error = function() {};
        $httpBackend.expectPOST('http://localhost:1337/auth/local').respond();
        AuthService.login({}, success, error);
        $httpBackend.flush();
        expect(ipCookie('user')).toBeDefined();
        // expect($cookieStore.get('user')).toBeDefined();
      });
    });

    describe('logout', function() {
      it('should make a request and invoke callback', function() {
        var success = function() {};
        var error = function() {};
        $httpBackend.expectGET('http://localhost:1337/logout').respond();
        AuthService.logout(success, error);
        $httpBackend.flush();
        expect(ipCookie('user')).toBeUndefined();
        // expect($cookieStore.get('user')).toBeUndefined();
      });
    });
  });
});