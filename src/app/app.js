(function() {
  'use strict';

  angular
    .module('dados', [
      'ui.router',
      'toastr',
      'ngAnimate',
      'naturalSort',
      'ngResource',
      'ngSanitize',
      'ngMaterial',
      'pascalprecht.translate',
      'angular.filter',
      'tmh.dynamicLocale',
      'LocalStorageModule',
      'ui.select',
      'angular.filter',

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

      // Altum/ARM
      'altum.client',
      'altum.client.overview',
      'altum.referral',
      'altum.billing',
      'altum.client',
      'altum.triage',
      'altum.servicevariation',
      'altum.servicemapper',

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
      'preferredLocale': 'altum'
    })
    .config(dadosConfig);

  dadosConfig.$inject = [
    '$stateProvider', '$translateProvider', '$uibTooltipProvider', 'uiGmapGoogleMapApiProvider', 'tmhDynamicLocaleProvider', 'toastrConfig'
  ];

  function dadosConfig($stateProvider, $translateProvider, $uibTooltipProvider, uiGmapGoogleMapApiProvider, dynamicLocale, toastrConfig) {
    $stateProvider.state('hateoas', {
      template: '<hateoas-client></hateoas-client>'
    });

    $translateProvider.useLoader('localeLoader');
    $translateProvider.preferredLanguage('altum');
    $translateProvider.useLocalStorage();
    $translateProvider.useMissingTranslationHandlerLog();
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.useMissingTranslationHandler('localeHandlerFactory');

    dynamicLocale.localeLocationPattern('vendor/angular-i18n/angular-locale_en-us.js');

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

    uiGmapGoogleMapApiProvider.configure({
      //    key: 'your api key',
      v: '3.20', //defaults to latest 3.X anyhow
      libraries: 'weather,geometry,visualization'
    });
  }

})();
