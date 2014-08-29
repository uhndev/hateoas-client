angular.module('hateoas.view', [])
  .directive('hateoasClient', 
  function($location, $compile, $templateCache) {
    var defaultTemplate = 
      $templateCache.get('hateoasClient/hateoas.tpl.html');

    function loadTemplate(scope, element, route) {
      var templateUrl = route.substring(1) + route + '.tpl.html';
      var fragment = $templateCache.get(templateUrl) || 
        defaultTemplate;
      element.html(fragment);
      $compile(element.contents())(scope);
    }

    function postLink(scope, element) {
      scope.$on('$locationChangeStart', 
        function(e, currentHref, prevHref) {
          if (currentHref && currentHref !== prevHref) {
            element.empty();
            loadTemplate(scope, element, $location.path());
          }
        });
      
      loadTemplate(scope, element, $location.path());
    }

    return {
      restrict: 'A',
      link: postLink
    };
  });
