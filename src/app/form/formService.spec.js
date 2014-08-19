describe('Form', function() {

  beforeEach(module('dados.form.service'));

  describe('FORM_API', function() {
    var API_CONSTANT;

    beforeEach( inject (function ($injector) {
      API_CONSTANT = $injector.get('FORM_API');
    }));

    it('exists', function () {
      expect(API_CONSTANT).toBeTruthy();
      expect(_.isString(API_CONSTANT)).toBeTruthy();
    });

    it('is a constant', inject(function($injector) {
      var value = $injector.get('FORM_API');
      value = null;
      expect($injector.get('FORM_API')).not.toEqual(value);
      expect($injector.get('FORM_API')).not.toBe(value);
    }));
  });

  describe('Form', function() {
    var mockFormResource, $httpBackend, url;

    beforeEach(function() {
      angular.mock.inject(['$httpBackend', 'Form', 'FORM_API',
        function(backend, Form, api) {
          $httpBackend = backend;
          mockFormResource = Form;
          url = api;
        }]);
    });

    describe('save', function() {
      it('should POST when an id is unavailable', function() {
        $httpBackend.whenPOST(url).respond(
          function(method, url, data, headers){
            return [200, {method: 'post'}, {}];
        });

        var result = mockFormResource.set({});

        $httpBackend.flush();
        expect(result.method).toEqual("post");
      });

      it('should PUT when an id is available', function() {
        $httpBackend.whenPUT(url + "/5").respond(
          function(method, url, data, headers){
            return [200, {method: 'put'}, {}];
        });

        var result = mockFormResource.set({id: 5});

        $httpBackend.flush();
        expect(result.method).toEqual("put");
      });

      it('should return null when archiving and id is unavailable', function() {
        var result = mockFormResource.archive({});
        expect(result).toEqual(null);
      });

      it('should DELETE when archiving and an id is available', function() {
        $httpBackend.whenDELETE(url + "/5").respond(
          function(method, url, data, headers){
            return [200, {method: 'delete'}, {}];
        });

        var result = mockFormResource.archive({id: 5});

        $httpBackend.flush();
        expect(result.method).toEqual("delete");
      });

    });
  });
});