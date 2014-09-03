angular.module('hateoas.view', [])
  .constant('VIEW_MODULES', [ 'Links', 'Title', 'Query', 
    'Controls', 'Collection' ])
  .directive('hateoasClient', [ '$location', '$compile', 
    '$templateCache', 'VIEW_MODULES',
  function($location, $compile, $templateCache, VIEW_MODULES) {
    /**
     * Private: getTemplates
     * Returns a list of potential url's where a template could be stored.
     * @param path - the current URL path.
     * @returns array of urls
     */
    function getTemplates(path) {
      var templates = _.map(VIEW_MODULES, function(module) {
        return [path.substring(1), path, 
          'View', module, '.tpl.html'].join('');
      });

      templates.push( 
        [path.substring(1), path, 'View.tpl.html'].join('')
      );
      return templates;
    }

    /**
     * Private: override
     * Predicate that verifies if a template exists in the templateCache.
     * @param templates - list of template urls
     * @returns boolean
     */
    function override(templates) {
      return _.some(templates, function(href) {
        return !!$templateCache.get(href); 
      });
    }

    /**
     * Private: build
     * Creates the full page HATEOAS template using templates as modules.
     * If an override template exists, then that template is used in place
     * of the default template.
     * @param path - current route path
     * @returns HTML fragment
     */
    function build(path) {
      var defaultViewLocation = 'hateoasClient/Views/hateoasView';
      var fragment = '<div ng-controller="HateoasController">';
      _.each(VIEW_MODULES, function(module) {
        var templateUrl = [path.substring(1), path, 
          'View', module, '.tpl.html'].join('');
        var defaultUrl = [defaultViewLocation, 
          module, '.tpl.html'].join('');

        fragment += $templateCache.get(templateUrl) || 
          $templateCache.get(defaultUrl);
      });
      fragment += '</div>';

      return fragment;
    }

    /**
     * Private: loadTemplate
     * Loads the template for the current route path and binds it to the 
     * scope.
     * @param scope
     * @param element
     * @param path
     */
    function loadTemplate(scope, element, path) {
      var templates = getTemplates(path);
      element.empty(); // triggers destroy;
      if (override(templates)) {
        var pageView = templates.pop();
        var fragment = $templateCache.get(pageView);
        if (!fragment) {
          // Optimization here, so next time we hit this page
          // we don't have to rebuild the template.
          fragment = build(path);
          $templateCache.put(pageView, fragment);
          _.each(templates, $templateCache.remove);
        }
        element.html(fragment);
      } else {
        // use the default
        var defaultView = 'hateoasClient/hateoasView.tpl.html';
        element.html($templateCache.get(defaultView));
      }
      $compile(element.contents())(scope);
    }

    /**
     * Private: postLink
     * Initialization for this directive. Sets up all events and creates
     * the first view. 
     */
    function postLink(scope, element) {
      scope.$on('$locationChangeStart', 
        function(e, currentHref, prevHref) {
          if (currentHref && currentHref !== prevHref) {
            loadTemplate(scope, element, $location.path());
          }
        });
      loadTemplate(scope, element, $location.path());
    }

    return {
      restrict: 'A',
      link: postLink
    };
  }]);
