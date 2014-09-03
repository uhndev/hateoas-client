angular.module('hateoas.controls', 
  ['hateoas.controls.controller', 'hateoas.utils'])
  .directive('hateoasControls', [ 'HateoasUtils', 
  function(HateoasUtils) {
    // Default constants values for the buttons
    var BTN_TEMPLATES = {
      'post' : {
        method: 'post',
        requiresItem: false,
        prompt: 'New',
        icon: 'fa-file-o'
      },
      'put' : {
        method: 'put',
        requiresItem: true,
        prompt: 'Edit',
        icon: 'fa-edit' 
      },
      'delete': {
        method: 'delete',
        requiresItem: true,
        prompt: 'Archive',
        icon: 'fa-trash-o'
      }
    };

    /**
     * Creates a list of buttons to draw based on the permissions
     */
    function postLink(scope, element, attribute) {
      var permissions = scope.permissions();
      if (permissions && _.isString(permissions)) {
        var allow = permissions.split(',');
        scope.controls = _.reduce(allow, 
          function(buttons, methodName) {
            methodName = methodName.trim().toLowerCase();
            if (_.has(BTN_TEMPLATES, methodName)) {
              buttons.push(BTN_TEMPLATES[methodName]);
            }
            return buttons;
          }, []);
      }
    }

    return {
      restrict: 'E',
      replace: true,
      scope: {
        template: '=',
        item: '=',
        href: '@',
        permissions: '&'
      },
      templateUrl: 'hateoasClient/Controls/hateoasControls.tpl.html',
      link: postLink,
      controller: 'HateoasControlsController'
    };
  }]);
