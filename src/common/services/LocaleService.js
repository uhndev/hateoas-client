/**
 * @name LocaleService
 * @description Service for getting/setting the current locale, available locales are
 *              defined in app.js as the LOCALES constant.
 */
(function() {
  'use strict';

  angular.module('dados')
    .service('LocaleService', LocaleService);

  LocaleService.$inject = ['$translate', 'LOCALES', 'TranslationService', 'localStorageService', '$rootScope', 'tmhDynamicLocale'];

  function LocaleService($translate, LOCALES, Translation, localStorageService, $rootScope, tmhDynamicLocale) {
    // PREPARING LOCALES INFO
    var localesObj = LOCALES.locales;

    // locales and locales display names
    var _LOCALES = Object.keys(localesObj);
    var _LOCALES_DISPLAY_NAMES = [];

    // STORING CURRENT LOCALE
    var currentLocale = $translate.proposedLanguage();// because of async loading

    var service = {
      localesObj: localesObj,
      _LOCALES: _LOCALES,
      _LOCALES_DISPLAY_NAMES: _LOCALES_DISPLAY_NAMES,
      getLocaleDisplayName: getLocaleDisplayName,
      setLocaleByDisplayName: setLocaleByDisplayName,
      getLocaleKeys: getLocaleKeys,
      getLocalesDisplayNames: getLocalesDisplayNames,
      setLocaleStorage: setLocaleStorage,
      removeLocaleStorage: removeLocaleStorage,
      updateLocales: updateLocales
    };

    init();

    // on successfully logging in, update locales
    $rootScope.$on('events.authorized', function (event, data) {
      service.updateLocales();
    });

    // on successful applying translations by angular-translate
    $rootScope.$on('$translateChangeSuccess', function (event, data) {
      document.documentElement.setAttribute('lang', data.language);// sets "lang" attribute to html

      // asking angular-dynamic-locale to load and apply proper AngularJS $locale setting
      tmhDynamicLocale.set(data.language.toLowerCase().replace(/_/g, '-'));
    });

    // use preferredLocale as fallback if locale file not found
    $rootScope.$on('$localeChangeError', function (event) {
      event.preventDefault();
      tmhDynamicLocale.set(LOCALES.preferredLocale.toLowerCase().replace(/_/g, '-'));
    });

    return service;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Private Methods
     */

    function init() {
      if (!_LOCALES || _LOCALES.length === 0) {
        console.error('There are no _LOCALES provided');
      }
      _LOCALES.forEach(function (locale) {
        _LOCALES_DISPLAY_NAMES.push(localesObj[locale]);
      });
    }

    function checkLocaleIsValid(locale) {
      return _LOCALES.indexOf(locale) !== -1;
    }

    function setLocale(locale) {
      if (!checkLocaleIsValid(locale)) {
        console.error('Locale name "' + locale + '" is invalid');
        return;
      }
      currentLocale = locale;// updating current locale
      // asking angular-translate to load and apply proper translations
      $translate.use(locale);
    }

    /**
     * Public Methods
     */

    function getLocaleDisplayName() {
      return localesObj[currentLocale];
    }

    /**
     * setLocaleByDisplayName
     * @description Sets the translation locale by display name
     * @param localeDisplayName
     */
    function setLocaleByDisplayName(localeDisplayName) {
      setLocale(
        _LOCALES[
          _LOCALES_DISPLAY_NAMES.indexOf(localeDisplayName)// get locale index
        ]
      );
    }

    /**
     * getLocaleKeys
     * @description Returns array of locale keys
     * @returns {*}
     */
    function getLocaleKeys() {
      return _.keys(LOCALES.locales);
    }

    /**
     * getLocalesDisplayName
     * @description Returns array of locale display names
     * @returns {Array}
     */
    function getLocalesDisplayNames() {
      return _LOCALES_DISPLAY_NAMES;
    }

    /**
     * setLocaleStorage
     * @description Writes a translation blob to local storage and reloads angular-translate
     * @param language
     */
    function setLocaleStorage(language, data) {
      localStorageService.set(language, data);
      $translate.refresh();
    }

    /**
     * removeLocaleStorage
     * @description Removes a translation blob from local storage and reloads angular-translate
     * @param language
     */
    function removeLocaleStorage(language) {
      localStorageService.remove(language);
      $translate.refresh();
    }

    /**
     * updateLocales
     * @description Checks server for updated translation data and reloads language select directive
     *              by emitting the locales.update event.
     */
    function updateLocales() {
      Translation.query().$promise
        .then(function (translations) {
          _.each(translations, function (translation) {
            localesObj[translation.language] = translation.translationKey;
            localStorageService.set(translation.language, angular.copy(translation.translation));
          });
          _LOCALES = Object.keys(localesObj);
          _LOCALES_DISPLAY_NAMES = _.pluck(translations, 'translationKey');
          $translate.refresh();
          $rootScope.$broadcast('locales.update');
        });
    }
  }

})();
