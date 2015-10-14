/**
 * @name hateoas-link
 * @description Takes a link-type, link-id and a text variable to navigate to another page.
 * @example
 *    <div hateoas-link url="http://localhost:1337/api/user/1"></div>
 *    <a hatesoas-link state-href="{{link.href}}">{{link.prompt}}</a>
 *    Both of the above will attach a click event to navigate the user to the url
 *
 */
(function() {
  'use strict';

  angular
    .module('dados.common.directives.hateoasLink', [])
    .directive('hateoasLink', hateoasLink);

  function hateoasLink($state, $location, API) {
    return {
      restrict: 'A',
      scope: {
        stateHref: '@',
        url: '@'
      },
      link: function(scope, elem, attrs) {
        var url = '';

        // if stateHref valid, add an href attribute to element
        if (scope.stateHref) {
          attrs.$set('href', '#' + scope.stateHref);
          url = scope.stateHref;
        }

        if (scope.url) {
          url = _.convertRestUrl(scope.url, API.prefix);
        }

        // bind click action to navigate
        elem.addClass('selectable');
        scope.handleClick = function() {
          if (scope.stateHref && $state.current.name !== 'hateoas') {
            $state.go('hateoas');
          }
          $location.path(url);
          scope.$apply();
        };
        elem.bind('click', scope.handleClick);
      }
    };
  }

})();
