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
       * Private: getTemplates
       * Returns a list of potential url's where a template could be stored.
       * @param path - the current URL path.
       * @returns array of urls
       */
      function getTemplates(path) {
        var pathArr = _.pathnameToArray(path);
        var model = _.first(pathArr);

        var templates;
        if (pathArr.length === 3) {
          var view = _.last(pathArr);
          templates = _.map(VIEW_MODULES, function(module) {
            return [model, '/', view, '/', view, 'View', module, '.tpl.html'].join('');
          });
          templates.push(
            [model, '/', view, '/', view, 'View.tpl.html'].join('')
          );
        }
        else if (pathArr.length === 2) {
          templates = _.map(ITEM_MODULES, function(module) {
            return [model, '/', model, 'View', module, '.tpl.html'].join('');
          });
          templates.push(
            [model, '/', model, 'View.tpl.html'].join('')
          );
        } else {
          templates = _.map(VIEW_MODULES, function(module) {
            return [path.substring(1), path,
              'View', module, '.tpl.html'].join('');
          });
          templates.push(
            [path.substring(1), path, 'View.tpl.html'].join('')
          );
        }

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
        var model = _.first(pathArr);
        var fragment;
        if (pathArr.length === 3) { // routes like /study/LEAP/collectioncentres
          var view = _.last(pathArr);
          fragment = '<div ng-controller="HateoasController as hateoas">';
          _.each(VIEW_MODULES, function(module) {
            var templateUrl = [model, '/', view, '/', view,
              'View', module, '.tpl.html'].join('');
            var defaultUrl = [defaultViewLocation,
              module, '.tpl.html'].join('');

            fragment += $templateCache.get(templateUrl) ||
              $templateCache.get(defaultUrl);
          });
        }
        else if (pathArr.length === 2) { // routes like /study/LEAP or /user/:id
          fragment = '<div>';
          _.each(ITEM_MODULES, function(module) {
            var templateUrl = [model, '/', model,
              'View', module, '.tpl.html'].join('');
            var defaultUrl = [defaultViewLocation,
              module, '.tpl.html'].join('');

            fragment += $templateCache.get(templateUrl) ||
              $templateCache.get(defaultUrl);
          });
        } else {
          fragment = '<div ng-controller="HateoasController as hateoas">';
          _.each(VIEW_MODULES, function(module) {
            var templateUrl = [path.substring(1), path,
              'View', module, '.tpl.html'].join('');
            var defaultUrl = [defaultViewLocation,
              module, '.tpl.html'].join('');

            fragment += $templateCache.get(templateUrl) ||
              $templateCache.get(defaultUrl);
          });
        }

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
        link: postLink,
        bindToController: true
      };
    }

})();
