angular.module('hateoas.utils', [])
  .service('HateoasUtils', function($location, $injector) {

    this.getService = function(suffix) {
      var model = _.capitalize($location.path().substring(1));
      var service = model + suffix;
      var defaultService = 'Hateoas' + suffix;
      return ($injector.has(service) ? 
        $injector.get(service) :
          ($injector.has(defaultService) ?
          $injector.get(defaultService) :
          null));
    };
  });
