(function() {
  'use strict';

  angular
    .module('altum.referral.serviceStatus')
    .factory('StatusFormFactory', StatusFormFactory);

  StatusFormFactory.$inject = ['TemplateService', 'StatusFormService'];

  function StatusFormFactory(TemplateService, StatusFormService) {
    var factory = {
      buildStatusForm: buildStatusForm
    };

    return factory;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * buildStatusForm
     * @description Accepts hateoasTemplate, new status object, category and service(s)
     *              to build a new systemform with concatenated fields that can come from
     *              payor specific StatusForms or programservice specific StatusForms
     * @param statusTemplate
     * @param newStatus
     * @param category
     * @param service
     * @returns {Object|Promise}
     */
    function buildStatusForm(statusTemplate, newStatus, category, service) {
      var filteredStatusTemplate = angular.copy(statusTemplate);
      filteredStatusTemplate.data = _.filter(filteredStatusTemplate.data, function (field) {
        return _.contains(newStatus.rules.requires[category], field.name);
      });
      var form = TemplateService.parseToForm({}, filteredStatusTemplate);

      var queryObj = {
        where: {
          status: newStatus.id
        },
        populate: 'systemform'
      };

      if (_.isArray(service)) { // build waterline query if multiple services
        // pluck out relevant ids for payors and programServices
        var payors = _.filter(_.map(service, 'payor'));
        var programServices = _.filter(_.map(service, 'programService'));

        switch (true) {
          case payors.length > 0 && programServices.length > 0:
            queryObj.where.or = [
              {payor: payors},
              {programservice: programServices}
            ];
            break;
          case payors.length > 0:
            queryObj.where.payor = payors;
            break;
          case programServices.length > 0:
            queryObj.where.programservice = programServices;
            break;
          default:
            break;
        }
      } else { // build waterline query if single service
        switch (true) {
          case _.isNumber(service.payor) && _.isNumber(service.programService):
            queryObj.where.or = [
              {payor: service.payor},
              {programservice: service.programService}
            ];
            break;
          case _.isNumber(service.payor):
            queryObj.where.payor = service.payor;
            break;
          case _.isNumber(service.programService):
            queryObj.where.programservice = service.programService;
            break;
          default:
            break;
        }
      }

      return StatusFormService.query(queryObj).$promise.then(function (statusForms) {
        // append any form questions coming from payor or programservice
        _.each(statusForms, function (statusForm) {
          form.form_questions = form.form_questions.concat(_.map(statusForm.systemform.form_questions, function (field) {
            field.isAdditionalData = true;
            return field;
          }));
        });

        // re-index field ids
        for (var i = 1; i <= form.form_questions.length; i++) {
          form.form_questions[i - 1].field_id = i;
        }

        form.form_title = _.isArray(service) ? 'Bulk Status Change' : 'Status Confirmation';
        form.form_submitText = _.isArray(service) ? 'Change Statuses' : 'Change Status';
        return form;
      });
    }
  }
})();
