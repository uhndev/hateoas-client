angular.module('hateoas.allowNav', [])
  .directive('allowNav', function() {

    function postLink(scope, element, attribute) {
      scope.canCreate = /POST/.test(scope.allow());
      scope.canUpdate = /PUT/.test(scope.allow());
      scope.canDelete = /DELETE/.test(scope.allow());
    }

    return {
      restrict: 'E',
      replace: true,
      scope: {
        allow: '&',
        selected: '&',
        create: '&',
        update: '&',
        delete: '&'
      },
      templateUrl: 'directives/allowNav/allowNav.tpl.html',
      link: postLink
    };

  });
