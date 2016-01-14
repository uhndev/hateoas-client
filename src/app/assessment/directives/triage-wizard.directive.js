(function() {
  'use strict';
  angular
    .module('altum.assessment.directives.triage', [
      'dados.common.directives.selectLoader'
    ])
    .directive('triageWizard', function() {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          referral: '='
        },
        templateUrl: 'assessment/directives/triageWizard.tpl.html',
        controller: TriageWizardController,
        controllerAs: 'triage',
        bindToController: true
      };
    });

  TriageWizardController.$inject = ['ServiceService'];

  function TriageWizardController(Service) {
    var vm = this;

    // bindable variables
    vm.hasError = !vm.referral;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
    }

  }

})();

