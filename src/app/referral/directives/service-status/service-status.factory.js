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

      var queryObj = {
        where: {
          status: newStatus.id
        },
        populate: 'systemform'
      };

      var parseStatusForms = function(statusForms, serviceObj) {
        var form = TemplateService.parseToForm({}, filteredStatusTemplate);
        // append any form questions coming from payor or programservice
        form.form_questions = _.reduce(statusForms, function (result, statusForm) {
          var statusFormFields = _.map(statusForm.systemform.form_questions, function (field) {
            field.isAdditionalData = true;
            return field;
          });
          return result.concat(statusFormFields);
        }, form.form_questions);

        // re-index field ids
        _.each(form.form_questions, function (question, index) {
          question.field_id = index + 1;
        });

        form.form_title = 'Status Confirmation ' + serviceObj.displayName;
        form.form_name = _.snakeCase(serviceObj.displayName) + '_form';
        form.form_submitText = 'Change Status';
        return form;
      };

      // pluck out relevant ids for payors and programServices
      var payorData = _.isArray(service) ? _.filter(_.map(service, 'payor')) : service.payor;
      var programServiceData = _.isArray(service) ? _.filter(_.map(service, 'programService')) : service.programService;

      // build waterline query if multiple services
      switch (true) {
        case _.isNumber(payorData) || _.isArray(payorData) &&
             _.isNumber(programServiceData) || _.isArray(programServiceData):
          queryObj.where.or = [
            {payor: payorData},
            {programservice: programServiceData}
          ];
          break;
        case !_.isUndefined(payorData):
          queryObj.where.payor = payorData;
          break;
        case !_.isUndefined(programServiceData):
          queryObj.where.programservice = programServiceData;
          break;
        default:
          // otherwise if no payor/programservice data, just parseforms
          return _.isArray(service) ? _.map(service, parseStatusForms) : parseStatusForms(service);
      }

      return StatusFormService.query(queryObj).$promise.then(function (statusForms) {
        if (_.isArray(service)) {
          // if an array of services, query the StatusForm table for service matching payor OR matching programservice
          return _.map(service, function (serviceObj) {
            var serviceStatusForms = _.filter(statusForms, function (statusForm) {
              return (serviceObj.programService === statusForm.programservice || serviceObj.payor === statusForm.payor);
            });
            return parseStatusForms(serviceStatusForms, serviceObj);
          });
        } else {
          // otherwise just return parsed form for single service
          return parseStatusForms(statusForms, service);
        }
      });
    }
  }
})();
