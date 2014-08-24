/**
 * Form Popup Directive
 * --------------------
 * Creates a button that opens a modal window that renders a given form by href.
 * Note that the submit and cancel callbacks are passed all the way through to 
 * the form-directive, which accepts its own pair of callbacks.
 * 
 * Attributes:
 * template - HATEOAS template response
 * text - Optional text to appear on button
 * onSubmit - callback function to execute on clicking submit
 * onCancel - callback function to execute on clicking cancel
 *
 * Usage (as element): 
 * <form-popup template="template" 
 *             text="Inspect" 
 *             on-submit="ok()" 
 *             on-cancel="cancel()">
 * </form-popup>
 *
 * Usage (as attribute): 
 * <button type="button" class="btn btn-default"
 *         ng-transclude form-popup 
 *         template="template" 
 *         on-submit="create()" 
 *         on-cancel="cancel()">Add
 * </button>
 */

angular.module('dados.common.directives.formPopup', [
  'dados.common.directives.formPopup.controller'
])

.directive('formPopup', function () {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    scope: {
      template: '=',
      onSubmit: '&',
      onCancel: '&'
    },
    template: '<button class="btn btn-default" ng-click="open()">{{text}}</button>',
    controller: 'FormPopupController',
    link: {
      pre: function (scope, element, attrs) {
        scope.text = attrs.text || 'View';
      },
      post: function (scope, element, attrs) {
        var isClickable = angular.isDefined(attrs.isClickable) && scope.$eval(attrs.isClickable) === true ? true : false;

        if (isClickable) {
          attrs.$set('ngClick', 'open()');
          element.removeAttr('ng-transclude');
          $compile(element)(scope);
        }
      }
    }
  };
});