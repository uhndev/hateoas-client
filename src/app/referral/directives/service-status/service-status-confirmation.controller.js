(function () {
  'use strict';

  angular
    .module('altum.referral.serviceStatus.confirmation.controller', [])
    .controller('ApprovalConfirmationModal', ApprovalConfirmationModal);

  ApprovalConfirmationModal.$inject = ['$uibModalInstance', 'newStatus', 'statusType', 'statusTemplateForm', 'TemplateService'];

  function ApprovalConfirmationModal($uibModalInstance, newStatus, statusType, statusTemplateForm, TemplateService) {
    var vm = this;

    // bindable variables
    vm.page = 1;
    vm.newStatus = newStatus;
    vm.statusTemplateForm = statusTemplateForm;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      // break up each statusForm into object value
      _.each(statusTemplateForm, function (templateForm, index) {
        // re-index field ids
        _.each(templateForm.form_questions, function (question, index) {
          question.field_id = index + 1;
        });
        vm[templateForm.form_name + index] = angular.copy(templateForm);
      });
    }

    /**
     * isFieldRequired
     * @description Returns true if field is required in confirmation form
     * @param field
     * @returns {Boolean}
     */
    vm.isFieldRequired = function (field) {
      return _.contains(vm.newStatus.rules.requires[statusType], field);
    };

    /**
     * confirm
     * @description Returns the approval object upon confirmation
     */
    vm.confirm = function () {
      var parseTemplateForm = function (statusForm) {
        var statusData = {
          status: newStatus.id
        };

        // sort out fields concatenated from payor/programservice status forms
        var additionalForm = angular.copy(statusForm);
        additionalForm.form_questions = _.filter(additionalForm.form_questions, {isAdditionalData: true});

        // filter out status specific fields
        statusForm.form_questions = _.reject(statusForm.form_questions, {isAdditionalData: true});

        statusData.additionalData = TemplateService.formToObject(additionalForm);
        return _.merge(statusData, TemplateService.formToObject(statusForm));
      };

      var answersToSave = _.isArray(statusTemplateForm) ? _.map(vm.statusTemplateForm, function (statusForm, index) {
        return parseTemplateForm(vm[statusForm.form_name + index]);
      }) : parseTemplateForm(vm.statusTemplateForm);

      $uibModalInstance.close(answersToSave);
    };

    /**
     * cancel
     * @description cancels and closes the modal window
     */
    vm.cancel = function () {
      $uibModalInstance.dismiss();
    };
  }

})();
