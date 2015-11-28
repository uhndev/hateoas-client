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

      // ARM
      'dados.arm.assessment',
      'dados.arm.altum_api',

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
      'translationPrefix': 'COMMON.MODELS.',
      'translateSuffix': '.IDENTITY',
      'preferredLocale': 'en_US'
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
    $translateProvider.useLocalStorage();
    $translateProvider.useMissingTranslationHandlerLog();
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.useMissingTranslationHandler('localeHandlerFactory');

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

    $mdThemingProvider.definePalette('dadosPalette', {
      '50': 'ffebee',
      '100': 'ffcdd2',
      '200': 'ef9a9a',
      '300': 'e57373',
      '400': 'ef5350',
      '500': 'f44336',
      '600': 'e53935',
      '700': 'd32f2f',
      '800': 'c62828',
      '900': 'b71c1c',

      'A100': '00538B', // header
      'A200': '3B7EAC', // subheader
      'A400': 'B1CBDF', // submenu
      'A700': 'E79949', // accent
      'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                          // on this palette should be dark or light
      'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
        '200', '300', '400', 'A100'],
      'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });

    $mdThemingProvider.theme('default')
      .primaryPalette('orange')
      .accentPalette('light-blue', {
        'default': '800'
      });
      //.accentPalette('dadosPalette', {
      //  'default': 'A200'
      //});
  }

})();
