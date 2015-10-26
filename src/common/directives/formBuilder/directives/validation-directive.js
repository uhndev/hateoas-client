/**
 * Directive handling additional validation options within form-builder
 * This directive is inserted wherever a field may have specific validation options
 */
(function() {
  'use strict';

  angular
    .module('dados.common.directives.formBuilder.directives.validation', [])
    .directive('validationDirective', validationDirective)
    .controller('ValidationController', ValidationController);

  validationDirective.$inject = ['$http', '$compile', '$templateCache'];
  ValidationController.$inject = ['$scope'];

  function validationDirective($http, $compile, $templateCache) {
    function linker(scope, element) {
      // GET template content from path
      var templateUrl = getTemplateUrl(scope.field);
      $http.get(templateUrl, {cache:$templateCache}).success(function(data) {
        element.html(data);
        $compile(element.contents())(scope);
      });    
    }

    return {
      template: '{{field}}',
      controller: ValidationController,
      restrict: 'E',
      scope: {
        field:'='
      },
      link: linker
    };
  }

  function getTemplateUrl(field) {
    var type = field.field_type;
    var templateUrl = '';

    if ((type == 'textfield') ||
      (type == 'email') ||
      (type == 'password') ||
      (type == 'textarea')) {
      templateUrl = 'directives/formBuilder/partials/directive-templates/validation/textfield.tpl.html';
    } else if (type == 'number') {
      templateUrl = 'directives/formBuilder/partials/directive-templates/validation/number.tpl.html';
    } else {
      templateUrl = 'directives/formBuilder/partials/directive-templates/validation/default.tpl.html';
    }

    return templateUrl;
  }  

  function ValidationController($scope) {
    $scope.textValidationRules = [
      {name:'None', value:'none'},
      {name:'Contains', value:'contains'},
      {name:'Does not contain', value:'not_contains'},
      {name:'Min Length', value:'min_length'},
      {name:'Max Length', value:'max_length'},
      {name:'Between', value:'between'}
    ];

    $scope.numberValidationRules = [
      {name:'None', value:'none'},
      {name:'Greater than', value:'gt'},
      {name:'Greater than or equal', value:'geq'},
      {name:'Less than', value:'lt'},
      {name:'Less than or equal', value:'leq'},
      {name:'Equal', value:'eq'},
      {name:'Not Equal', value:'neq'},
      {name:'Between', value:'between'},
      {name:'Not Between', value:'not_between'}
    ];
  }

})();