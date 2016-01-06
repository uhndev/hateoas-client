(function() {
  'use strict';

  angular
    .module('dados')
    .controller('DadosController', DadosController);

  DadosController.$inject = ['$scope', '$state', '$translate', '$rootScope', '$location', 'LOCALES', 'AuthService', 'DefaultRouteService'];

  function DadosController($scope, $state, $translate, $rootScope, $location, LOCALES, Auth, DefaultRoute) {

    var vm = this;
    vm.submenu = {};

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      if (Auth.isAuthenticated()) {
        if (_.isEmpty($location.path())) {
          // url is empty, so just use default settings
          DefaultRoute.route(Auth.currentUser.group.level);
        } else {
          // otherwise, try matching currentUrl to state urls to find the correct state
          var isCustomState = false;
          angular.forEach($state.get(), function (state) {
            var currentUrl = $location.path();
            if (state.name && state.url && currentUrl == state.url ||
              (_.has(state, 'data') && currentUrl == state.data.fullUrl)) {
              $state.go(state.name);
              isCustomState = true;
            }
          });

          // no matches, default to hateoas state
          if (!isCustomState) {
            $state.go('hateoas');
          }
        }
      }
    }

    /**
     * setPageTitle
     * @description Breaks current URL into array and attempts to translate each item accordingly.
     *              If no translation is found, the item is returned as-is.
     */
    function setPageTitle() {
      // construct translated pageTitle from location url
      var currentPaths = _.pathnameToArray($location.path().replace(/(\/\d+)/g, ''));
      var possibleKeys = _.map(currentPaths, function (path) {
        return [LOCALES.translationPrefix, path.toUpperCase(), LOCALES.translationSuffix].join('');
      });

      $translate(possibleKeys).then(function (translations) {
        $scope.pageTitle = _.map(_.zip(possibleKeys, currentPaths), function (path) {
          // if translation found, replace with translation
          if (!_.startsWith(translations[path[0]], LOCALES.translationPrefix)) {
            return _.capitalize(translations[path[0]]);
          }
          return _.capitalize(path[1]);
        }).join(' ');
      });
    }

    $scope.$on('$locationChangeStart', function(e, current, prev) {
      var page = $location.path();
      if (page.charAt(page.length -  1) == '/') { // remove trailing slashes if they exist
        $location.url(page.slice(0, -1));
      }
      if (!Auth.isAdmin() && Auth.isAdminPage(page)) {
        $state.go('forbidden');
      }
    });

    $scope.$on('$locationChangeSuccess', function(e, current, prev) {
      var prevBaseUrl = _.parseUrl($location, prev)[0];     // e.g. /study
      var basePath = _.pathnameToArray($location.path());
      var currBaseUrl = _.first(basePath);                  // e.g. /user
      if (prevBaseUrl !== currBaseUrl) { // clear submenu if base path changes
        vm.submenu = {};
      }

      // construct pageTitle from location url
      setPageTitle();
    });

    // on successful applying translations by angular-translate
    $rootScope.$on('$translateChangeSuccess', function (event, data) {
      setPageTitle();
    });

    $scope.$on('submenu.clear', function(e) {
      vm.submenu = {};
    });
  }

})();
