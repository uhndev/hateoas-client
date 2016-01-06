(function() {
  'use strict';
  angular
    .module('dados.header.controller', ['ui.bootstrap'])
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = [
    '$state', '$location', '$translate', '$rootScope', 'ResourceFactory', 'AuthService', 'API'
  ];

  function HeaderController($state, $location, $translate, $rootScope, ResourceFactory, AuthService, API) {

    var vm = this;

    // private variables
    var pathArray = _.pathnameToArray($location.path());
    var baseModel = _.first(pathArray);
    var Model = ResourceFactory.create(API.url() + '/' + baseModel);

    // bindable variables
    vm.isVisible = AuthService.isAuthenticated();
    vm.isSubjectView = AuthService.isSubject();
    vm.currentUser = '';
    vm.navigation = [];

    // bindable methods
    vm.logout = logout;
    vm.follow = follow;
    vm.refresh = refresh;
    vm.changeContext = changeContext;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      vm.locale = $translate.use();
      updateHeader();
      updateActive();
    }

    function refresh(query) {
      if ($state.is('hateoas') && vm.navigation.length > 0 && !AuthService.isAdminPage($location.path())) {
        pathArray = _.pathnameToArray($location.path());
        baseModel = _.first(pathArray);
        Model = ResourceFactory.create(API.url() + '/' + baseModel);

        var queryParams = {
          sort: 'displayName ASC'
        };
        if (query) {
          queryParams.where = {
            displayName: {
              'contains': query
            }
          };
        }
        vm.selectionModels = Model.query(queryParams);
      } else {
        vm.showSearch = false;
      }
    }

    function changeContext() {
      if (pathArray.length > 1) {
        pathArray[1] = vm.selected;
        $location.url(pathArray.join('/'));
      } else {
        $location.url([baseModel, vm.selected].join('/'));
      }
      vm.showSearch = false;
    }

    /**
     * Private Methods
     */

    function updateHeader() {
      if (AuthService.currentGroup) {
        if (AuthService.tabview !== vm.navigation) {
          vm.navigation = AuthService.tabview;
        }
      }

      if (AuthService.currentUser) {
        vm.currentUser = AuthService.currentUser;
      }
    }

    function updateActive() {
      var href = $location.path();

      _.each(vm.navigation, function(link) {
        var pathArr = _.pathnameToArray(href);
        var comparator = (pathArr.length >= 2) ? '/' + _.first(pathArr) : href;
        if (link.dropdown) {
          _.each(link.dropdown, function(droplink) {
            droplink.isActive = (comparator.toLowerCase() === droplink.href.toLowerCase());
          });
        } else {
          link.isActive = (comparator.toLowerCase() === link.href.toLowerCase());
        }
      });

      _.each(vm.submenu.links, function(link) {
        var clientUrl = _.convertRestUrl(link.href, API.prefix);
        link.isActive =
          ($location.path().toLowerCase() === clientUrl.toLowerCase());
      });

      refresh();
      delete vm.selected;
    }

    /**
     * Public Methods
     */

    function follow(link) {
      if (link) {
        if (link.rel) {
          $location.path(_.convertRestUrl(link.href, API.prefix));
        }
      }
    }

    function logout() {
      vm.isVisible = false;
      vm.navigation = [];
      vm.submenu = [];
      AuthService.logout();
    }

    // watchers
    $rootScope.$on('events.unauthorized', function() {
      vm.isVisible = false;
      vm.navigation = [];
    });

    $rootScope.$on('events.authorized', function() {
      vm.isVisible = true;
      vm.isSubjectView = AuthService.isSubject();
      updateHeader();
    });

    $rootScope.$on('$locationChangeSuccess', updateActive);

    $rootScope.$on('$translateChangeSuccess', function (event, data) {
      vm.locale = data.language;
    });
  }

})();
