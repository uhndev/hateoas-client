describe('dados.filters.type', function() {
  beforeEach(module('dados.filters.type'));

  describe('isArray', function() {
    it('should verify an array data type', 
      inject(function(isArrayFilter) {
        expect(isArrayFilter([])).toBeTruthy();
        expect(isArrayFilter({})).not.toBeTruthy();
        expect(isArrayFilter('hello')).not.toBeTruthy();
      }));
  });

  describe('isObject', function() {
    it('should verify an object data type', 
      inject(function(isObjectFilter) {
        expect(isObjectFilter([])).toBeTruthy();
        expect(isObjectFilter({})).toBeTruthy();
        expect(isObjectFilter('hello')).not.toBeTruthy();
      }));
  });

  describe('isString', function() {
    it('should verify a string data type', 
      inject(function(isStringFilter) {
        expect(isStringFilter([])).not.toBeTruthy();
        expect(isStringFilter({})).not.toBeTruthy();
        expect(isStringFilter('hello')).toBeTruthy();
      }));
  });

});

