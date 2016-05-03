(function() {
  'use strict';
  angular.module('dados.common.directives.hateoas.modal.controller', [
    'ui.bootstrap.modal',
    'dados.common.services.template'
  ])
  .controller('HateoasModalController', HateoasModalController);

  HateoasModalController.$inject = [
    '$scope', '$resource', '$uibModalInstance', '$q', 'TemplateService'
  ];

  function HateoasModalController($scope, $resource, $uibModalInstance, $q, TemplateService) {
    // Loads values into the form.
    function loadValues(form) {
      TemplateService.loadAnswerSet($scope.item, $scope.template, form);
      $scope.form = form.items;

      var method = (_.isEmpty($scope.item)) ? 'create' : 'update';

      // if blacklist was included in hateoas template, filter system form questions by blacklisted attributes
      if ($scope.template.blacklist[method] && $scope.template.blacklist[method].length > 0) {
        $scope.form.form_questions = _.reject(form.items.form_questions, function (field) {
          return _.contains($scope.template.blacklist[method], field.field_name);
        });
      }
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
      $uibModalInstance.close(TemplateService.formToObject($scope.form));
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };

    loadTemplate($scope.template).then(loadValues);
  }
})();
