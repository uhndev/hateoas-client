(function() {
  'use strict';

  angular
    .module('dados.header.service', [
      'dados.auth.service'
    ])
    .service('HeaderService', HeaderService);

  HeaderService.$inject = ['$rootScope', 'AuthService'];

  function HeaderService($rootScope, AuthService) {

    var submenu = [];

    var service = {
      submenu: submenu,
      setSubmenu: setSubmenu,
      clearSubmenu: clearSubmenu
    };

    return service;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * setSubmenu
     * @description From any submenu page, we need to parse and render a hateoas resource's
     *              links array to populate our submenu in our top level scope
     * @param {String} state         string representation of our current relative state
     * @param {Array}  resourceLinks         a links array from a hateoas response object
     */
    function setSubmenu(state, resourceLinks) {
      // initialize submenu
      if (state && _.isArray(resourceLinks) && resourceLinks.length > 0) {
        // setup one-time watch on currentGroup to be loaded before setting submenu
        var unreg = $rootScope.$watch(function () {
          return AuthService.subview;
        }, function (subview) {
          if (_.has(subview, state)) {
            service.submenu = AuthService.getRoleLinks(state, resourceLinks);
            unreg(); // de-registers watch once submenu is set
          }
        });
      }
    }

    /**
     * clearSubmenu
     * @description Empties the submenu array
     */
    function clearSubmenu() {
      service.submenu = [];
    }

  }

})();
