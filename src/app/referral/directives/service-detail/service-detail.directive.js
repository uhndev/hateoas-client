/**
 * @name service-detail
 * @description Abstracted component for picking service details for recommendations
 * @example
 *    <service-detail referral="rec.referral"
 *                    service="rec.recommendedServices[rec.currIndex]">
 *    </service-detail>
 */
(function() {
  angular
    .module('altum.referral.serviceDetail', [])
    .component('serviceDetail', {
      bindings: {
        referral: '<',  // bound referral containing client information
        service: '='    // single service object containing details
      },
      controller: 'ServiceDetailController',
      controllerAs: 'detail',
      templateUrl: 'referral/directives/service-detail/service-detail.tpl.html'
    })
    .controller('ServiceDetailController', ServiceDetailController);

  ServiceDetailController.$inject = ['$uibModal', 'AltumAPIService'];

  function ServiceDetailController($uibModal, AltumAPI) {
    var vm = this;

    // bindable variables
    vm.referral = vm.referral || {};
    vm.service = vm.service || {};

    // bindable methods
    vm.openVariationModal = openVariationModal;
    vm.openMap = openMap;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * openVariationModal
     * @description Click handler for new/edit functionality for variations.  Will pass in
     *              an empty base variation if creating new.
     * @param canEdit
     */
    function openVariationModal(canEdit) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'servicevariation/variationModal.tpl.html',
        controller: 'VariationModalController',
        controllerAs: 'varmodal',
        bindToController: true,
        windowClass: 'variations-modal-window',
        resolve: {
          displayMode: function () {
            return true;
          },
          Variation: function () {
            return vm.service.serviceVariation;
          },
          Selection: function () {
            var variations = angular.copy(vm.service.variationSelection);
            return variations ? variations.changes : null;
          }
        }
      });

      modalInstance.result.then(function (selection) {
        // store selected variations
        vm.service.variationSelection = {
          changes: angular.copy(selection)
        };

        // if service was selected as a variation, update appropriate data
        if (_.has(selection, 'service')) {
          // rename service in recommended services tab
          AltumAPI.AltumService.get({id: selection.service.value.altumService, populate: 'sites'}, function (altumService) {
            vm.service.variationSelection.name = altumService.name;

            if (altumService.sites.length > 0) {
              vm.service.availableSites = altumService.sites;
              vm.service.siteDictionary = _.indexBy(altumService.sites, 'id');
            }
          });

          // store altum/program service to be applied on save
          vm.service.variationSelection.altumService = selection.service.value.altumService;
          vm.service.variationSelection.programService = selection.service.value.programService;
        }
      });
    }

    /**
     * openMap
     * @description opens a modal window for the mapModal site picker
     */
    function openMap() {
      var modalInstance = $uibModal.open({
        animation: true,
        windowClass: 'map-modal-window',
        templateUrl: 'referral/triage/mapModal.tpl.html',
        controller: 'MapModalController',
        controllerAs: 'mapmodal',
        bindToController: true,
        size: 'lg',
        resolve: {
          selectedSite: function () {
            if (!_.isEmpty(vm.selectedSite)) {
              return AltumAPI.Site.get({
                id: vm.service.site,
                populate: 'address'
              }).$promise;
            } else {
              return null;
            }
          },
          sites: function () {
            return AltumAPI.Site.query({
              where: {
                id: _.pluck(vm.service.availableSites, 'id')
              }
            }).$promise;
          },
          referral: function () {
            return {
              title: vm.referral.client_displayName,
              addressID: vm.referral.client_address,
              addressName: _.values(_.pick(vm.referral, 'client_address1', 'client_address2', 'client_city', 'client_province', 'client_postalCode', 'client_country')).join(' '),
              latitude: vm.referral.client_latitude,
              longitude: vm.referral.client_longitude
            };
          }
        }
      });

      modalInstance.result.then(function (selectedSite) {
        vm.service.site = angular.copy(selectedSite.id);
      });
    }
  }

})();
