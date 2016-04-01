(function() {
  'use strict';

  angular
    .module('dados')
    .controller('DadosController', DadosController);

  DadosController.$inject = ['$scope', '$state', '$translate', '$rootScope', '$location', 'LOCALES', 'HeaderService', 'AuthService', 'DefaultRouteService'];

  function DadosController($scope, $state, $translate, $rootScope, $location, LOCALES, Header, Auth, DefaultRoute) {

    var vm = this;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      if (!Auth.isAuthenticated()) {
        $state.go('login');
      }
    }

    /**
     * setPageTitle
     * @description Set the page title according to JSON namespace
     */
    function setPageTitle() {
      var currentPaths = _.pathnameToArray($location.path().replace(/(\/\d+)/g, ''));
      if (currentPaths.length == 1) {
        $scope.pageTitle = LOCALES.translationPrefix + currentPaths[0].toUpperCase() + LOCALES.translateSuffix;
      }
      if (currentPaths.length == 2) {
        $scope.pageTitle = LOCALES.translationPrefix + currentPaths[0].toUpperCase() + '.' + currentPaths[1].toUpperCase() + LOCALES.translateSuffix;
      }
    }

    $scope.$on('$locationChangeStart', function(e, current, prev) {
      var page = $location.path();
      var prevBaseUrl = _.parseUrl($location, prev)[0];     // e.g. /study
      var basePath = _.pathnameToArray($location.path());
      var currBaseUrl = _.first(basePath);                  // e.g. /user
      if (prevBaseUrl !== currBaseUrl) { // clear submenu if base path changes
        Header.clearSubmenu();
      }
      if (page.charAt(page.length -  1) == '/') { // remove trailing slashes if they exist
        $location.url(page.slice(0, -1));
      }
      if (Auth.isAuthenticated() && !Auth.isAdmin() && Auth.isAdminPage(page)) {
        $state.go('forbidden');
      }
    });

    $scope.$on('$locationChangeSuccess', function(e, current, prev) {
      // construct pageTitle from location url
      setPageTitle();
    });

    // on successful applying translations by angular-translate
    $rootScope.$on('$translateChangeSuccess', function (event, data) {
      setPageTitle();
    });

    // on authorization event fired, navigate to home state
    $rootScope.$on('events.authorized', function() {
      DefaultRoute.route();
    });
  }

})();
