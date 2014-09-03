angular.module('hateoas.utils', ['hateoas'])
  .constant('HATEOAS_PREFIX', 'Hateoas')
  .service('HateoasUtils', 
    [ '$location', '$injector', 'HATEOAS_PREFIX',
  function($location, $injector, HATEOAS_PREFIX) {

    function getFactories(suffix) {
      var model = _.capitalize($location.path().substring(1));
      return {
        model: model + suffix,
        default: HATEOAS_PREFIX + suffix
      };
    }

    /**
     * Public: getService
     * Returns the Service Factory for a HATEOAS route.
     */
    this.getService = function (suffix) {
      var factories = getFactories(suffix);
      
      return ($injector.has(factories.model) ?
        $injector.get(factories.model) :
          ($injector.has(factories.default) ?
            $injector.get(factories.default) :
            null ));
    };

  }]);
