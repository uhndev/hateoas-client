(function() {
  'use strict';

  angular
    .module('dados.header.service', [])
    .service('HeaderService', HeaderService);

  HeaderService.$inject = [ 'AuthService' ];

  function HeaderService(AuthService) {

    return {
      setSubmenu: setSubmenu
    };

    ///////////////////////////////////////////////////////////////////////////

    /**
     * setSubmenu
     * @description From any submenu page, we need to parse and render a hateoas resource's
     *              links array to populate our submenu in our top level scope
     * @param {String} state         object representation of our current relative state
     * @param {Object} resource      a hateoas response object containing a links array
     * @param {Object} submenuScope  a reference to the scope where the submenu is defined
     */
    function setSubmenu(state, resource, submenuScope) {
      // initialize submenu
      if (!_.isEmpty(state) && _.has(resource, 'links') && resource.links.length > 0) {
        // from workflowstate and current url study
        // replace wildcards in href with study name
        _.map(resource.links, function(link) {
          if (link.rel === 'name' && link.prompt === '*') {
            link.prompt = state.prompt;
          }
          if (_.contains(link.href, '*')) {
            link.href = link.href.replace(/\*/g, state.value);
          }
          return link;
        });

        angular.copy({
          links: AuthService.getRoleLinks(state.rel, resource.links)
        }, submenuScope);
      }
    }

  }

})();
