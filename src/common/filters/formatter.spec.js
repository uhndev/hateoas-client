describe('dados.filters.formatter', function() {
  beforeEach(module('dados.filters.formatter'));

  describe('formatter', function() {

    it('should pad mrn\'s with zeros', 
      inject(function(formatterFilter) {
        expect(formatterFilter(123, { 'name': 'mrn' })).toBe('0000123');
        expect(formatterFilter(1234567, {'name':'mrn'})).toBe(1234567);
      }));

    it('should return the date from ISO strings', 
      inject(function(formatterFilter) {
        var d = new Date('2001-01-01').toISOString();
        expect(formatterFilter(d, { 'type': 'date' })).toBe('2001-01-01');
      }));

    it('should return a value if it has no modifier', 
      inject(function(formatterFilter) {
        expect(formatterFilter('hello', {})).toBe('hello');
      }));

  });

});
