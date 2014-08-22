var HATEOAS = HATEOAS || {};

HATEOAS = {
  createService : function createHateoasService () {
    return function(url, $resource) {
      var Resource = $resource(url + '/:id', {id : '@id'}, {
        'query': { method: 'GET', isArray: false },
        'update' : { method: 'PUT' }
      });

      Resource.set = function(data) {
        var resource = new Resource(data);
        if (_.has(resource, 'id')) {
          return resource.$update();
        } else {
          return resource.$save();
        }
      };
    
      Resource.archive = function(data) {
        if (_.has(data, 'id')) {
          return Resource.remove(data);
        }
        return null;
      };
    
      return Resource;
    };
  }
};
