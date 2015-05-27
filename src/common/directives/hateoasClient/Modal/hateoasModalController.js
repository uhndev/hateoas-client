(function() {
  'use strict';
  angular.module('dados.common.directives.hateoas.modal.controller', [
    'ui.bootstrap.modal', 
    'dados.common.services.template'
  ])
  .controller('HateoasModalController', HateoasModalController);

  HateoasModalController.$inject = [
    '$scope', '$resource', '$modalInstance', '$q', 'TemplateService'
  ];
  
  function HateoasModalController($scope, $resource, $modalInstance, $q, TemplateService) {
    // Loads values into the form.
    function loadValues(form) {
      TemplateService.loadAnswerSet($scope.item, $scope.template, form);
      $scope.form = form.items;
    }

    // Loads a template from the server if the injected template contains
    // a URL to the form. If the form is empty, construct the from using
    // the data array from the template.
    function loadTemplate(template) {
      if (template.href) {
        return $resource(template.href).get().$promise;
      } else {
        return $q.when({
          items: TemplateService.parseToForm($scope.item, template)
        });
      }
    }

    $scope.done = function() {
      $modalInstance.close(TemplateService.formToObject($scope.form));
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

    loadTemplate($scope.template).then(loadValues);
  }
})();