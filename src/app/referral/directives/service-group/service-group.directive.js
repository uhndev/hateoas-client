/**
 * @name service-group
 * @description Takes a list of services and organizes them into groups
 * @example
 *    <service-group services="servies.services"
 *                   search="services.search"
 *                   bound-group-types="services.boundGroupTypes"
 *                   visit-fields="services.visitFields"
 *                   summary-fields="services.summaryFields"
 *                   on-init="services.init">
 *    </service-group>
 *
 */
(function() {
  'use strict';

  angular
    .module('altum.referral.serviceGroup', [
      'altum.referral.serviceStatus.controller'
    ])
    .component('serviceGroup', {
      bindings: {
        services: '=',
        search: '=',
        boundGroupTypes: '=',
        visitFields: '=',
        summaryFields: '<',
        onUpdate: '='
      },
      templateUrl: 'referral/directives/service-group/service-group.tpl.html',
      controller: 'ServiceGroupController',
      controllerAs: 'serviceGroup'
    })
    .controller('ServiceGroupController', ServiceGroupController);

  ServiceGroupController.$inject = ['$scope', '$uibModal', '$resource', 'API', 'toastr', 'AltumAPIService', 'STATUS_TYPES'];

  function ServiceGroupController($scope, $uibModal, $resource, API, toastr, AltumAPI, STATUS_TYPES) {
    var vm = this;
    var BulkStatusChange = $resource(API.url('service/bulkStatusChange'), {}, {
      'save' : {method: 'POST', isArray: false}
    });

    // bindable variables
    vm.templates = {};
    _.each(['approval', 'completion', 'billing'], function (statusType) {
      var StatusType = $resource(API.url(STATUS_TYPES[statusType].model), {}, {
        'query': {method: 'GET', isArray: false}
      });
      StatusType.query({where: {id: 0}, limit: 1}, function (data) {
        vm.templates[statusType] = data.template;
      });
    });

    // bindable methods
    vm.applyAll = applyAll;
    vm.applyStatusChanges = applyStatusChanges;
    vm.isStatusDisabled = isStatusDisabled;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var filteredStatuses = _.filter(['approval', 'completion', 'billing'], function(field) {
        return _.contains(_.map(vm.visitFields, 'name'), field);
      });

      if (filteredStatuses.length) {
        AltumAPI.Status.query({where: {category: filteredStatuses}}, function (statuses) {
          vm.statuses = _.groupBy(statuses, 'category');
        });
      }

      // if no statuses are visible, hide checkboxes
      vm.checkboxesVisible = filteredStatuses.length > 0;
    }

    /**
     * applyAll
     * @description Click handler for table header level checkbox, will apply checkbox value to all subServices
     * @param services
     * @param value
     */
    function applyAll(services, value) {
      _.each(services, function (service) {
        service.isSelected = value;
      });
    }

    /**
     * applyStatusChanges
     * @description On change handler for summary status pickers, should update statuses for all services in subServices
     * @param services
     * @param category
     */
    function applyStatusChanges(services, category) {
      var affectedServices = _.filter(services, {isSelected: true});

      // only show popup when changing to Approved status
      if (vm.statusSelections[category] && vm.statusSelections[category].requiresConfirmation) {
        var modalInstance = $uibModal.open({
          animation: true,
          template: '<form-directive form="ac.statusTemplateForm" on-submit="ac.confirm()" on-cancel="ac.cancel()"></form-directive>',
          controller: 'ApprovalConfirmationModal',
          controllerAs: 'ac',
          bindToController: true,
          resolve: {
            newStatus: function () {
              return vm.statusSelections[category];
            },
            statusType: function () {
              return category;
            },
            statusTemplateForm: function (TemplateService, StatusFormService) {
              var newStatus = angular.copy(vm.statusSelections[category]);

              // if overrideForm set, fetch systemform from API
              if (newStatus.overrideForm) {
                var SystemForm = $resource(API.url() + '/systemform');
                return SystemForm.get({id: newStatus.overrideForm}).$promise.then(function (data) {
                  return data.items;
                });
              }
              // otherwise, parse newStatus template into a systemform and filter based on vm.statusSelections[category].rules
              else {
                var filteredStatusTemplate = angular.copy(vm.templates[category]);
                filteredStatusTemplate.data = _.filter(filteredStatusTemplate.data, function (field) {
                  return _.contains(vm.statusSelections[category].rules.requires[category], field.name);
                });
                var form = TemplateService.parseToForm({}, filteredStatusTemplate);

                return StatusFormService.query({where: {
                  status: vm.statusSelections[category].id,
                  or: [
                    {payor: _.map(services, 'payor')},
                    {programservice: _.map(services, 'programService')}
                  ]
                }, populate: 'systemform'}).$promise.then(function (statusForms) {
                  // append any form questions coming from payor or programservice
                  _.each(statusForms, function (statusForm) {
                    form.form_questions = form.form_questions.concat(statusForm.systemform.form_questions);
                  });

                  // re-index field ids
                  for (var i = 1; i <= form.form_questions.length; i++) {
                    form.form_questions[i - 1].field_id = i;
                  }

                  form.form_title = 'Bulk Status Change';
                  form.form_submitText = 'Change Statuses';
                  return form;
                });
              }
            }
          }
        });

        modalInstance.result.then(function (answers) {
          saveStatuses(affectedServices, category, answers);
        }, function () {
          // if cancelled, revert back to previous selection
          vm.statusSelections[category] = null;
        });
      }
      else if (vm.statusSelections[category]) {
        // otherwise just save the new status changes for all selected services
        saveStatuses(affectedServices, category, {status: vm.statusSelections[category].id});
      }
    }

    /**
     * isStatusDisabled
     * @description Simple convenience function for disabling summary status pickers if nothing is checked
     * @param services
     * @returns {boolean}
     */
    function isStatusDisabled(services) {
      return _.any(services, {isSelected: true});
    }

    /**
     * saveStatuses
     * @description Private function for making actual save call to service approvals
     * @param services
     * @param category
     * @param approvalObj
     */
    function saveStatuses(services, category, approvalObj) {
      var bulkStatusChange = new BulkStatusChange({
        model: STATUS_TYPES[category].model,
        newStatuses: _.map(services, function (service) {
          return _.merge({service: service.id}, approvalObj);
        })
      });

      bulkStatusChange.$save(function (updatedStatuses) {
        toastr.success(services.length + ' service(s) updated to: ' + vm.statusSelections[category].name, 'Services');
        vm.statusSelections[category] = null;
        vm.onUpdate();
      });
    }

    /**
     * watchVisitFields
     * @description When visitFields change, may need to fetch additional statuses for dropdowns
     * @param newVal
     * @param oldVal
     */
    function watchVisitFields(newVal, oldVal) {
      if (newVal !== oldVal) {
        init();
      }
    }
    $scope.$watchCollection('serviceGroup.visitFields', watchVisitFields);
  }

})();
