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
    .module('altum.referral.serviceGroup', [])
    .component('serviceGroup', {
      bindings: {
        services: '=',
        search: '=',
        boundGroupTypes: '=',
        visitFields: '<',
        summaryFields: '<',
        onUpdate: '='
      },
      templateUrl: 'referral/directives/service-group/service-group.tpl.html',
      controller: 'ServiceGroupController',
      controllerAs: 'serviceGroup'
    })
    .controller('ServiceGroupController', ServiceGroupController);

  ServiceGroupController.$inject = ['$scope', '$uibModal', '$resource', 'API', 'AltumAPIService'];

  function ServiceGroupController($scope, $uibModal, $resource, API, AltumAPI) {
    var vm = this;
    var Approval = $resource(API.url('approval'), {}, {
      'query': {method: 'GET', isArray: false}
    });
    var Completion = $resource(API.url('completion'), {}, {
      'query': {method: 'GET', isArray: false}
    });
    var BillingStatus = $resource(API.url('billingstatus'), {}, {
      'query': {method: 'GET', isArray: false}
    });

    vm.templates = {};
    Approval.query({where: {id: 0}, limit: 1}, function (approval) {
      vm.templates.approval = approval.template;
    });
    Completion.query({where: {id: 0}, limit: 1}, function (completion) {
      vm.templates.completion = completion.template;
    });
    BillingStatus.query({where: {id: 0}, limit: 1}, function (billingStatus) {
      vm.templates.billing = billingStatus.template;
    });

    vm.applyAll = applyAll;
    vm.applyStatusChanges = applyStatusChanges;
    vm.isStatusDisabled = isStatusDisabled;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      var filteredStatuses = _.filter(['approval', 'completion', 'billing'], function(field) {
        return _.contains(_.map(vm.visitFields, 'name'), field);
      });
      AltumAPI.Status.query({where: {category: filteredStatuses}}, function (statuses) {
        vm.statuses = _.groupBy(statuses, 'category');
      });
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
      // only show popup when changing to Approved status
      if (vm.statusSelections[category].requiresConfirmation) {
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
            statusTemplateForm: function (TemplateService) {
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
                form.form_title = 'Status Confirmation';
                form.form_submitText = 'Change Status';
                return form;
              }
            }
          }
        });

        modalInstance.result.then(function (answers) {
          saveStatuses(services, category, answers);
        }, function () {
          // if cancelled, revert back to previous selection
          vm.statusSelections[category] = null;
        });
      } else {
        // otherwise just save the new status changes for all services
        saveStatuses(services, category, {status: vm.statusSelections[category].id});
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
      console.log(services.length, category, approvalObj);
    }

    function watchVisitFields(newVal, oldVal) {
      if (newVal !== oldVal) {
        init();
      }
    }
    $scope.$watchCollection('serviceGroup.visitFields', watchVisitFields);
  }

})();
