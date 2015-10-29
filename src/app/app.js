(function() {
  'use strict';

  angular.module('dados', [
    'ui.router',
    'toastr',
    'ngAnimate',
    'ngResource',
    'ngSanitize',
    'pascalprecht.translate',

    'templates-app',
    'templates-common',

    'dados.constants',
    'dados.access',
  	'dados.auth',
    'dados.study',
    'dados.subject',
    'dados.survey',
    'dados.user',
    'dados.header',
    'dados.workflow',
    'dados.formbuilder',
    'dados.systemformbuilder',
    'dados.collectioncentre',

    'dados.filters.formatter',
    'dados.filters.type',

    'dados.common.services',
    'dados.common.interceptors',
    'dados.common.directives'
  ])
  .config(dadosConfig)
  .controller('DadosController', DadosController);

  dadosConfig.$inject = ['$stateProvider', '$translateProvider', '$translatePartialLoaderProvider', '$tooltipProvider', 'toastrConfig'];

  function dadosConfig($stateProvider, $translateProvider, $translatePartialLoaderProvider, $tooltipProvider, toastrConfig) {
    $stateProvider.state('hateoas', {
      template: '<div class="container" hateoas-client></div>'
    });

    $translateProvider.useLoader('$translatePartialLoader', {
      urlTemplate: 'i18n/{part}-{lang}.json'
    });
    $translatePartialLoaderProvider.addPart('common');

    $translateProvider.determinePreferredLanguage();
    $translateProvider.useSanitizeValueStrategy('sanitize');

    angular.extend(toastrConfig, {
      autoDismiss: true,
      closeButton: true,
      positionClass: 'toast-bottom-right',
      progressBar: true,
      tapToDismiss: true,
      timeOut: 3000
    });

    $tooltipProvider.options({
      appendToBody: true
    });
  }

  DadosController.$inject = ['$scope', '$state', '$translate', '$location', 'AuthService'];

  function DadosController($scope, $state, $translate, $location, Auth) {

    var vm = this;
    vm.submenu = {};
    vm.locale = '';
    vm.changeLanguage = changeLanguage;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      if (_.isEmpty($location.path())) {
        $location.path('/study');
      }
      $state.go('hateoas');
    }

    function changeLanguage() {
      $translate.use(vm.locale);
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
