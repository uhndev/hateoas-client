(function() {
  'use strict';
  angular.module('dados.common.directives.hateoas.utils', [])
    .constant('HATEOAS_PREFIX', 'Hateoas')
    .service('HateoasUtils', HateoasUtils);

  HateoasUtils.$inject = ['$location', '$injector', 'HATEOAS_PREFIX'];
    
  function HateoasUtils($location, $injector, HATEOAS_PREFIX) {
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
  }
})();
