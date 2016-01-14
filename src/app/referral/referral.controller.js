(function () {
  'use strict';

  angular
    .module('altum.referral', [])
    .controller('ReferralController', ReferralController);

  ReferralController.$inject = ['$scope', '$resource', '$location', 'API', 'HeaderService'];

  function ReferralController($scope, $resource, $location, API, HeaderService) {
    var vm = this;

    // bindable variables
    vm.url = API.url() + $location.path();

    // bindable methods

    init();

    ////////////////

    function init() {
      var Resource = $resource(vm.url);

      Resource.get(function (data, headers) {
        vm.allow = headers('allow');
        vm.template = data.template;
        vm.resource = angular.copy(data);
        vm.title = data.items.name;

        // initialize submenu
        HeaderService.setSubmenu('client', data.links);
      });
    }

    $scope.$on('hateoas.client.refresh', function () {
      init();
    });
  }

})();

