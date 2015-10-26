/**
 *
 */
(function() {
  'use strict';

  angular
    .module('dados.common.directives.pluginEditor.directives.uiWidget', [
    ])
    .directive('uiWidget', uiWidget);

  uiWidget.$inject = ['$http', '$templateCache', '$compile', '$q'];

  function uiWidget($http, $templateCache, $compile, $q) {
    function linker(scope, element, attributes) {
      var childScope = null;

      /**
       * procedure: getTemplates
       *
       * Fetches a list of 'GET' requests to components to build a template.
       * The components are defined as arguments for the getTemplates method.
       *
       * @return list of 'GET' requests to fetch templates.
       */
      var getTemplates = function() {
        var templates = [];

        if (arguments.length) {
          angular.forEach(arguments, function(template) {
            templates.push($http.get(template, {cache: $templateCache}));
          });
        }

        return templates;
      };

      /**
       * function: getNewScope
       *
       * To avoid memory leaks, old scopes should be destroyed and new ones
       * created. This allows us to keep the parent scope pristine and avoid
       * causing any memory issues.
       *
       * @return a copy of the current parent scope.
       */
      var getNewScope = function(oldScope) {
        if (oldScope) {
          oldScope.$destroy();
          oldScope = null;
        }
        element.empty();
        return scope.$new();
      };

      /**
       * callback: renderTemplates
       *
       * Once all the templates are fetched from the server, the HTML fragments
       * are appended to the parent element and compiled.
       */
      var renderTemplates = function(templates) {
        angular.forEach(templates, function(template) {
          element.append(template.data);
        });
        $compile(element.contents())(childScope);
      };

      /**
       * observer: rebuildTemplate
       *
       * Any time the template value changes, the widget must be re-created
       * and rendered to the front-end.
       */
      var rebuildTemplate = function(newTemplate) {
        if (newTemplate) {
          childScope = getNewScope(childScope);
          var templateList = [];

          if (!scope.hideLabel()) {
            templateList.push('directives/pluginEditor/partials/WidgetLabel.tpl.html');
          }

          templateList.push('directives/pluginEditor/partials/widgets/' + newTemplate + '.tpl.html');
          var templates = getTemplates.apply(null, templateList);

          if (templates.length) {
            // Only render the templates after each template has been
            // retrieved using the $q promise.
            $q.all(templates).then(renderTemplates);
          }
        }
      };

      // Setup an observer
      scope.$watch('widget.template', rebuildTemplate);
    }

    return {
      templateUrl: 'directives/pluginEditor/partials/Widget.tpl.html',
      restrict: 'E',
      replace: false,
      scope: {
        widget : '=',
        widgetModel : '=',
        hideLabel: '&',
        editMode: '&'
      },
      link : linker,
      terminal: true
    };
  }

})();
