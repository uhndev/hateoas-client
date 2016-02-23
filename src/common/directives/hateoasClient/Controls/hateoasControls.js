(function() {
  'use strict';
  angular
    .module('dados.common.directives.hateoas.controls', [
      'dados.common.directives.hateoas.controls.controller',
      'dados.common.directives.hateoas.controls.service'
    ])
    .directive('hateoasControls', ['HateoasUtils',

    function(HateoasUtils) {
      // Default constants values for the buttons
      var BTN_TEMPLATES = {
        'read': {
          method: 'get',
          requiresItem: true,
          prompt: 'COMMON.HATEOAS.CONTROLS.OPEN_BTN',
          icon: 'fa-folder-o'
        },
        'create' : {
          method: 'post',
          requiresItem: false,
          prompt: 'COMMON.HATEOAS.CONTROLS.NEW_BTN',
          icon: 'fa-file-o'
        },
        'update' : {
          method: 'put',
          requiresItem: true,
          prompt: 'COMMON.HATEOAS.CONTROLS.EDIT_BTN',
          icon: 'fa-edit'
        },
        'delete': {
          method: 'delete',
          requiresItem: true,
          prompt: 'COMMON.HATEOAS.CONTROLS.ARCHIVE_BTN',
          icon: 'fa-trash-o'
        }
      };

      /**
       * Creates a list of buttons to draw based on the permissions retrieved
       * from the allows dadosHeader included in server response.
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
        templateUrl: 'directives/hateoasClient/Controls/hateoasControls.tpl.html',
        link: postLink,
        controller: 'HateoasControlsController'
      };
    }]);
})();
