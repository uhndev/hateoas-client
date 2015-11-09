(function() {
  'use strict';

  angular
    .module('dados')
    .controller('DadosController', DadosController);

  DadosController.$inject = ['$scope', '$state', '$location', 'AuthService', 'LocaleService'];

  function DadosController($scope, $state, $location, Auth, Locale) {

    var vm = this;
    vm.submenu = {};

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      Locale.updateLocales();
      if (_.isEmpty($location.path())) {
        $location.path('/study');
      }
      $state.go('hateoas');
    }

    $scope.$on('$locationChangeStart', function(e, current, prev) {
      var page = $location.path();
      if (_.has(Auth.currentUser, 'group') &&
        Auth.currentUser.group.level > 1 &&
        (page == '/systemformbuilder' || page == '/formbuilder' || page == '/access')) {
        $location.path('/400');
      }
    });

    $scope.$on('$locationChangeSuccess', function(e, current, prev) {
      $scope.pageTitle = _.titleCase($location.path()
        .replace(/\//g, ' ')
        .toLowerCase()
        .trim());
    });

    $scope.$on('submenu.clear', function(e) {
      vm.submenu = {};
    });
  }

})();
