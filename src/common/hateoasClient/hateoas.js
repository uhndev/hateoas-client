angular.module('hateoas', ['hateoas.controller'])
  .constant('HateoasUtils', {
    generate: function(route, stateName, pageTitle) {
      return {
        name: stateName || route.replace(/\//g, ''),
        url: route,
        templateUrl: 'hateoasClient/hateoas.tpl.html',
        controller: 'HateoasController',
        data: {
          pageTitle: pageTitle || _.capitalize(route.replace(/\//g, ' '))
        },
        resolve: {
          Actions: function() {
            return {};
          }
        }
      };
    }
  });
