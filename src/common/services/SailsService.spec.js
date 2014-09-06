describe('SailsService', function() {

  beforeEach(module('dados.common.services.sails'));

  describe('Sails ng-table adapter', function() {
    var service = null, mockNgTableParams = null, sailsParams = null;

    beforeEach( inject(function($injector) {
      service = $injector.get('sailsNgTable');
      mockNgTableParams = {
        count: function() {
          return 10;
        },
        page: function() {
          return 1;
        },
        sorting: function() {
          return {
            name: 'ASC'  
          };
        },
        filter: function() {
          return {
            age: 5,
            name: 'Fred'
          };
        }
      };
      sailsParams = service.parse(mockNgTableParams);
    }));

    it('exists', function() {
      expect(service).toBeTruthy();
      expect(_.isObject(sailsParams) && 
        !_.isArray(sailsParams)).toBeTruthy();
    });

    it('converts count to limit', function() {
      expect(_.has(sailsParams, 'limit')).toBeTruthy();
      expect(sailsParams.limit).toEqual(mockNgTableParams.count());
    });

    it('converts page to skip', function() {
      expect(_.has(sailsParams, 'skip')).toBeTruthy();
      expect(sailsParams.skip)
        .toEqual((mockNgTableParams.page() - 1) * mockNgTableParams.count());
    });

    it('converts sorting() to sort', function() {
      expect(_.has(sailsParams, 'sort')).toBeTruthy();
      expect(sailsParams.sort).toEqual('name ASC');
    });

    it('merges filter()', function() {
      expect(_.has(sailsParams, 'name')).toBeTruthy();
      expect(_.has(sailsParams, 'age')).toBeTruthy();
      expect(sailsParams['name']).toEqual('Fred');
      expect(sailsParams['age']).toEqual(5);
    });

    it('merges the query and skips filter()', function() {
      expect(_.has(sailsParams, 'where')).not.toBeTruthy();
      var query = { where: { name: 'Bob', age: 10 } };
      sailsParams = service.parse(mockNgTableParams, query);
      expect(_.has(sailsParams, 'name')).not.toBeTruthy();
      expect(_.has(sailsParams, 'age')).not.toBeTruthy();
      expect(_.has(sailsParams, 'where')).toBeTruthy();
      expect(sailsParams.where).toEqual(query.where);
    });

  });

});
