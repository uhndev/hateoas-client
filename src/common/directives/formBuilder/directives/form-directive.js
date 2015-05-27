/**
 * Directive for rendering forms - can be viewed as single question carousel
 * or full page form.  Accepts two callback functions to be used for form
 * submission and cancellation.
 *
 * usage: <form-directive form="scopeForm" onSubmit="submitFn()" onCancel="cancelFn()"></form-directive>
 */

(function() {
  'use strict';

  angular
    .module('dados.common.directives.formBuilder.directives.form', [])
    .directive('formDirective', formDirective);

  formDirective.$inject = ['$http', '$compile', '$templateCache'];

  function formDirective($http, $compile, $templateCache) {

    var linker = function(scope, element, attrs, ngModel) {    
      // GET template content from path
      var templateUrl = 'directives/formBuilder/partials/directive-templates/form/form.tpl.html';
      $http.get(templateUrl, {cache:$templateCache}).success(function(data) {
        element.html(data);
        $compile(element.contents())(scope);
      });

      // default to list view if form type is system
      var unreg = scope.$watch('form', function(val, old) {
        if (!_.isEmpty(val)) {
          scope.formPreview = (scope.form.form_type == 'system');
          unreg();
        }
      }, true);
    };

    return {
      restrict: 'E',
      link: linker,
      scope: {
        form:'=',
        onSubmit:'&',
        onCancel:'&'
      }
    };
  }

})();