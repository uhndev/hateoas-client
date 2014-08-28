angular.module('hateoas', ['hateoas.controller'])
  .constant('HateoasUtils', {
    generate: function(route, stateName, pageTitle) {
      return {
        name: stateName || route.replace(/\//g, ''),
        url: route,
        views: {
          'main': {
            templateUrl: 'hateoasClient/hateoas.tpl.html',
            controller: 'HateoasController'
          }
        },
        data: {
          pageTitle: pageTitle || route.replace(/\//g, ' ')
        }
      };
    }
  });
