(function() {
  'use strict';

  angular
    .module('dados.common.directives.formBuilder.directives.name', [])
    .directive('dynamicName', dynamicName);

  dynamicName.$inject = ['$compile', '$parse'];

  // allows for dynamic form and input names in forms
  function dynamicName($compile, $parse) {
    return {
      restrict: 'A',
      terminal: true,
      priority: 100000,
      link: function(scope, elem) {
        var name = $parse(elem.attr('dynamic-name'))(scope);
        elem.removeAttr('dynamic-name');
        elem.attr('name', name);
        $compile(elem)(scope);
      }
    };
  }

})();