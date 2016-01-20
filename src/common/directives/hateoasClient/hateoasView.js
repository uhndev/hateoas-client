(function() {
  'use strict';

  angular.module('dados.common.directives.hateoas.view', [])
    .constant('VIEW_MODULES', [
      'Links', 'Title', 'Query', 'Controls', 'Collection'
    ])
    .constant('ITEM_MODULES', ['Overview'])
    .directive('hateoasClient', hateoasClient);

    hateoasClient.$inject = [
      '$location', '$compile', '$templateCache', 'VIEW_MODULES', 'ITEM_MODULES'
    ];

    function hateoasClient($location, $compile, $templateCache, VIEW_MODULES, ITEM_MODULES) {
      /**
       * Private: cleanURL
       * Helper function that strips out IDs and study names from URL.
       * Returns a processed URL.
       * @param path - the current URL path.
       */
      function cleanURL(path) {
        var cleanPath = path.replace(/\/study\/.+?(?=\/|$)/, '/study'); // to strip study name (/study/leap to /study)
        return cleanPath.replace(/(\/\d+)/g, '');                       // then to strip ids (/subject/1 to /subject)
      }

      /**
       * Private: getTemplates
       * Returns a list of potential url's where a template could be stored.
       * @param path - the current URL path.
       * @returns array of urls
       */
      function getTemplates(path) {
        var pathArr = _.pathnameToArray(path);
        var cleanPath = cleanURL(path);
        var last = _.last(_.pathnameToArray(cleanPath));

        var modules = ((pathArr.length % 2) === 0) ? ITEM_MODULES : VIEW_MODULES;

        var templates = _.map(modules, function(module) {
          return [cleanPath.substring(1), '/', last, 'View', module, '.tpl.html'].join('');
        });
        templates.push(
          [cleanPath.substring(1), '/', last, 'View.tpl.html'].join('')
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
        var defaultViewLocation = 'directives/hateoasClient/Views/hateoasView';
        var pathArr = _.pathnameToArray(path);
        var cleanPath = cleanURL(path);
        var last = _.last(_.pathnameToArray(cleanPath));

        // Default: collection view (routes like /study/LEAP/collectioncentres)
        var fragment = '<div class="container" ng-controller="HateoasController as hateoas">';
        var modules = VIEW_MODULES;

        if ((pathArr.length % 2) === 0) {
          // single item view (routes like /study/LEAP or /user/:id)
          modules = ITEM_MODULES;
          fragment = '<div class="container" ng-controller="HateoasItemController as hateoas">';
        }

        _.each(modules, function(module) {
          var templateUrl = [cleanPath.substring(1), '/', last,
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
        var pathArr = _.pathnameToArray(path);
        // if there was already an inherited scope, $destroy to prevent memory leak
        if (scope.inheritedScope) {
          scope.inheritedScope.$destroy();
        }
        // create new inherited scope each time
        scope.inheritedScope = scope.$new(false);
        var templates = getTemplates(path);
        element.empty(); // triggers destroy;
        if (override(templates)) {
          var pageView = templates.pop();
          var fragment = $templateCache.get(pageView);
          if (!fragment) {
            // Optimization here, so next time we hit this page
            // we don't have to rebuild the template.
            fragment = build(path);
            // only cache for non-item views
            if (path.split('/').length !== 3) {
              $templateCache.put(pageView, fragment);
              _.each(templates, $templateCache.remove);
            }
          }
          element.html(fragment);
        } else {
          // use the default
          var defaultView = 'directives/hateoasClient/hateoasView.tpl.html';
          if ((pathArr.length % 2) === 0) {
            defaultView = 'directives/hateoasClient/hateoasViewItem.tpl.html';
          }
          element.html($templateCache.get(defaultView));
        }
        // use inherited scope
        $compile(element.contents())(scope.inheritedScope);
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
        link: postLink,
        bindToController: true
      };
    }

})();
