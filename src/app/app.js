(function() {
  'use strict';

  angular
    .module('dados', [
      'ui.router',
      'toastr',
      'ngAnimate',
      'ngResource',
      'ngSanitize',
      'pascalprecht.translate',
      'tmh.dynamicLocale',

      'templates-app',
      'templates-common',

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

      'dados.filters.formatter',
      'dados.filters.type',

      'dados.common.services',
      'dados.common.interceptors',
      'dados.common.directives'
    ])
    .constant('LOCALES', {
      'locales': {
        'en_US': 'COMMON.LANGUAGES.ENGLISH',
        'fr': 'COMMON.LANGUAGES.FRENCH'
      },
      preferredLocale: 'en_US'
    })
    .config(dadosConfig);

  dadosConfig.$inject = [
    '$stateProvider', '$translateProvider', '$translatePartialLoaderProvider', '$tooltipProvider', 'tmhDynamicLocaleProvider', 'toastrConfig'
  ];

  function dadosConfig($stateProvider, $translateProvider, $translatePartialLoaderProvider, $tooltipProvider, dynamicLocale, toastrConfig) {
    $stateProvider.state('hateoas', {
      template: '<div class="container" hateoas-client></div>'
    });

    $translateProvider.useLoader('$translatePartialLoader', {
      urlTemplate: 'i18n/{part}-{lang}.json'
    });

    $translatePartialLoaderProvider.addPart('common');
    $translateProvider.determinePreferredLanguage();
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
  }

})();
