(function() {
  'use strict';

  angular
    .module('dados', [
      'ui.router',
      'toastr',
      'ngAnimate',
      'ngResource',
      'ngSanitize',
      'ngMaterial',
      'pascalprecht.translate',
      'tmh.dynamicLocale',
      'LocalStorageModule',

      // html templateCaches
      'templates-app',
      'templates-common',

      // dados admin pages
      'dados.constants',
      'dados.access',
      'dados.auth',
      'dados.study',
      'dados.schedule',
      'dados.subject',
      'dados.survey',
      'dados.user',
      'dados.header',
      'dados.workflow',
      'dados.formbuilder',
      'dados.systemformbuilder',
      'dados.collectioncentre',
      'dados.translation',

      // dados subject portal
      'dados.subjectportal',

      'dados.filters.formatter',
      'dados.filters.type',

      'dados.common.services',
      'dados.common.interceptors',
      'dados.common.directives'
    ])
    .constant('LOCALES', {
      'locales': {
        'en_US': 'COMMON.LANGUAGES.ENGLISH',
        'fr': 'COMMON.LANGUAGES.FRENCH',
        'altum': 'COMMON.LANGUAGES.ALTUM'
      },
      preferredLocale: 'en_US'
    })
    .config(dadosConfig);

  dadosConfig.$inject = [
    '$stateProvider', '$translateProvider', '$tooltipProvider', '$mdThemingProvider', 'tmhDynamicLocaleProvider', 'toastrConfig'
  ];

  function dadosConfig($stateProvider, $translateProvider, $tooltipProvider, $mdThemingProvider, dynamicLocale, toastrConfig) {
    $stateProvider.state('hateoas', {
      template: '<div class="container" hateoas-client></div>'
    });

    $translateProvider.useLoader('localeLoader');
    $translateProvider.preferredLanguage('en_US');
    $translateProvider.useMissingTranslationHandlerLog();
    $translateProvider.useSanitizeValueStrategy('escaped');

    dynamicLocale.localeLocationPattern('vendor/angular-i18n/angular-locale_{{locale}}.js');

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

    $mdThemingProvider.theme('default')
      .primaryPalette('orange')
      .accentPalette('light-blue', {
        'default': '800'
      });
  }

})();
