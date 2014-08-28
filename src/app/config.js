angular.module('config', ['hateoas', 'ui.router'])
  .constant('ROUTES', [
    '/person',
    '/study',
    '/user',
    '/form',
    '/answerset',
    [ '/study/:name/subject', 'Subjects' ]
  ])
  .config( function myAppConfig ( $stateProvider, HateoasUtils, ROUTES ) {
    angular.forEach(ROUTES, function(route) {
      if (_.isString(route)) {
        $stateProvider.state(HateoasUtils.generate(route));
      }
      if (_.isArray(route)) {
        $stateProvider.state(HateoasUtils.generate.apply(null, route));
      }
    });
  });

