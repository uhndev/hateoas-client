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
      'ui.select',

      // html templateCaches
      'templates-app',
      'templates-common',

      // dados admin pages
      'dados.constants',
      'dados.access',
      'dados.auth',
      'dados.error',
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
      'translationPrefix': 'COMMON.MODELS.',
      'translateSuffix': '.IDENTITY',
      'preferredLocale': 'en_US'
    })
    .config(dadosConfig);

  dadosConfig.$inject = [
    '$stateProvider', '$translateProvider', '$uibTooltipProvider', 'tmhDynamicLocaleProvider', 'toastrConfig'
  ];

  function dadosConfig($stateProvider, $translateProvider, $uibTooltipProvider, dynamicLocale, toastrConfig) {
    $stateProvider.state('hateoas', {
      template: '<hateoas-client></hateoas-client>'
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

    $uibTooltipProvider.options({
      appendToBody: true
    });
  }

})();
