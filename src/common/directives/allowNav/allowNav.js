angular.module('hateoas.allowNav', [])
  .directive('allowNav', function() {

    function postLink(scope, element, attribute) {
      scope.actions = scope.callbacks();
      scope.canCreate = /POST/.test(scope.permissions());
      scope.canUpdate = /PUT/.test(scope.permissions());
      scope.canDelete = /DELETE/.test(scope.permissions());
    }

    return {
      restrict: 'E',
      replace: true,
      scope: {
        template: '=',
        permissions: '&',
        selected: '&',
        callbacks: '&'
      },
      templateUrl: 'directives/allowNav/allowNav.tpl.html',
      link: postLink
    };

  });
