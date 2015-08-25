/**
 * @name hateoas-link
 * @description Takes a link-type, link-id and a text variable to navigate to another page.
 * @example
 *    <div hateoas-link link-type="user" link-id="1"></div>
 *    <div hateoas-link url="http://localhost:1337/api/user/1"></div>
 *    Both of the above will attach a click event to navigate the user to the url
 *
 */
(function() {
  'use strict';

  angular
    .module('dados.common.directives.hateoasLink', [])
    .directive('hateoasLink', hateoasLink);

  function hateoasLink($location, API) {
    return {
      restrict: 'A',
      scope: {
        url: '@',
        linkType: '@',
        linkId: '@'
      },
      link: function(scope, elem) {
        // compute link to navigate to
        var url = '';
        if (!angular.isDefined(scope.url)) {
          url = '/' + scope.linkType;
          if (!_.isNull(scope.linkId)) {
            url += '/' + scope.linkId;
          }
        } else {
          url = _.convertRestUrl(scope.url, API.prefix);
        }

        // bind click action to navigate
        elem.addClass('selectable');
        scope.handleClick = function() {
          $location.path(url);
          scope.$apply();
        };
        elem.bind('click', scope.handleClick);
      }
    };
  }

})();
