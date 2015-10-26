/** 
 * Directive for rendering different field types in forms
 * Accepts a field object and parses its values to load appropriate templates.
 *
 * usage: <field-directive field="someField"></field-directive>
 */
(function() {
  'use strict';

  angular
    .module('dados.common.directives.formBuilder.directives.field', [])
    .directive('fieldDirective', fieldDirective);

  fieldDirective.$inject = ['$http', '$compile', '$templateCache'];

  function fieldDirective($http, $compile, $templateCache) {

    var linker = function(scope, element, attrs) {
      // GET template content from path
      var templateUrl = 'directives/formBuilder/partials/directive-templates/field/' +
                         scope.field.field_type + '.tpl.html';
      $http.get(templateUrl, {cache:$templateCache}).success(function(data) {
        element.html(data);
        $compile(element.contents())(scope);
      });
    };

    return {
      template: '<div>{{field}}</div>',
      controller: 'FieldController',
      restrict: 'E',
      scope: {
        field: '='
      },
      link: linker
    };
  }

})();
