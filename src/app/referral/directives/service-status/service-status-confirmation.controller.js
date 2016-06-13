(function () {
  'use strict';

  angular
    .module('altum.referral.serviceStatus.confirmation.controller', [])
    .controller('ApprovalConfirmationModal', ApprovalConfirmationModal);

  ApprovalConfirmationModal.$inject = ['$scope', '$uibModalInstance', 'newStatus', 'statusType', 'statusTemplateForm', 'TemplateService'];

  function ApprovalConfirmationModal($scope, $uibModalInstance, newStatus, statusType, statusTemplateForm, TemplateService) {
    var vm = this;

    // bindable variables
    vm.page = 1;
    vm.newStatus = newStatus;
    vm.statusTemplateForm = statusTemplateForm;
    vm.answerPage = _.map(statusTemplateForm, function (form) {
      return {additionalData: {}};
    });
    vm.statusData = {
      status: newStatus.id
    };

    // set required fields to null in approval object
    _.each(vm.newStatus.rules.requires[statusType], function (field) {
      vm.statusData[field] = null;
    });

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

      if (_.isArray(statusTemplateForm)) {
        $uibModalInstance.close(_.map(vm.answerPage, function (answers) {
          return _.merge({
            status: newStatus.id
          }, answers);
        }));
      } else {
        $uibModalInstance.close(parseTemplateForm(vm.statusTemplateForm));
      }
    };

    /**
     * cancel
     * @description cancels and closes the modal window
     */
    vm.cancel = function () {
      $uibModalInstance.dismiss();
    };

    /**
     * changePage
     * @description Click handler for changing pages, will clear field_values and apply any saved
     *              answers to the current form on the current page.
     */
    vm.change = function() {
      _.each(vm.statusTemplateForm, function (form) {
        _.each(form.form_questions, function (question) {
          delete question.field_value;
        });
      });

      _.each(vm.statusTemplateForm[vm.page - 1].form_questions, function (question) {
        if (question.isAdditionalData) {
          question.field_value = angular.copy(vm.answerPage[vm.page - 1].additionalData[question.field_name]);
        } else {
          question.field_value = angular.copy(vm.answerPage[vm.page - 1][question.field_name]);
        }
      });
    };

    /**
     * saveFormAnswers
     * @description Watcher on array of statusForms; will save progress as answers are entered in
     * @param newVal
     * @param oldVal
     */
    function saveFormAnswers(newVal, oldVal) {
      if (oldVal !== newVal && _.isArray(statusTemplateForm)) {
        console.log(newVal);
        _.each(newVal.form_questions, function (question) {
          if (question.isAdditionalData) {
            vm.answerPage[vm.page - 1].additionalData[question.field_name] = question.field_value;
          } else {
            vm.answerPage[vm.page - 1][question.field_name] = question.field_value;
          }
        });
      }
    }
    $scope.$watch('ac.statusTemplateForm[ac.page-1]', saveFormAnswers, true);
  }

})();
