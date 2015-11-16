(function () {
  'use strict';
  angular
    .module('dados.translation.controller', ['khchan.translate-editor'])
    .controller('TranslationController', TranslationController);

  TranslationController.$inject = ['$q', 'toastr', 'TranslationService', 'LocaleService'];

  function TranslationController($q, toastr, Translation, Locale) {
    var vm = this;

    // bindable variables
    vm.languages = Locale.getLocaleKeys();
    vm.translationKeys = [];
    vm.resource = [];
    vm.translations = {};
    vm.translationsReady = false;
    vm.queries = [
      {
        label: 'Auth Module',
        search: '//AUTH'
      },
      {
        label: 'Menu Labels',
        search: '//MENU'
      },
      {
        label: 'Model Identities',
        search: '//IDENTITY'
      },
      {
        label: 'Open Buttons',
        search: '//OPEN_BTN'
      },
      {
        label: 'Languages',
        search: '//LANGUAGES'
      }
    ];

    // bindable methods
    vm.saveChanges = saveChanges;
    vm.onUpdate = onUpdate;
    vm.onRemove = onRemove;
    vm.cloneLanguage = cloneLanguage;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      Translation.query().$promise
        .then(function (translations) {
          vm.resource = angular.copy(translations);
          _.each(translations, function (translation) {
            vm.translations[translation.language] = angular.copy(translation.translation);
          });
          vm.languages = _.keys(vm.translations);
          vm.translationKeys = _.pluck(translations, 'translationKey');
        })
        .then(function () {
          vm.translationsReady = true;
        });
    }

    /**
     * saveChanges
     * @description Saves any and all changes in translations to the server
     */
    function saveChanges() {
      $q.all(
        _.map(vm.resource, function (translationObj) {
          var translation = new Translation({
            translation: vm.translations[translationObj.language]
          });
          return translation.$update({ id: translationObj.id });
        })
      )
      .then(function (data) {
        var updatedData = angular.copy(_.pluck(data, 'items'));
        _.each(updatedData, function (translation) {
          Locale.setLocaleStorage(translation.language, translation.translation);
        });
        toastr.success('Updated all translations!', 'Translation');
        init();
      });
    }

    /**
     * onUpdate
     * @description Callback function for angular-translate-editor, is the on click
     *              handler for updating an individual language translation.
     * @param language Language key for translation
     * @returns {*}
     */
    function onUpdate(language) {
      var translationID = _.find(vm.resource, { language: language }).id;
      var translation = new Translation({
        translation: vm.translations[language]
      });
      return translation.$update({ id: translationID }).then(function (data) {
        toastr.success('Updated translations for language ' + language + '!', 'Translation');
        Locale.setLocaleStorage(language, angular.copy(vm.translations[language]));
        init();
      });
    }

    /**
     * onRemove
     * @description Callback function for angular-translate-editor, is the on click
     *              handler for removing an individual language translation.
     * @param language Language key for translation
     * @returns {*}
     */
    function onRemove(language) {
      var conf = confirm("Are you sure you want to archive this language?");
      if (conf) {
        vm.languages = _.without(vm.languages, language);
        delete vm.translations[language];

        var translationID = _.find(vm.resource, { language: language }).id;
        var translation = new Translation({ id: translationID });
        translation.$delete().then(function () {
          toastr.success('Archived translation '+ language + '!', 'Translation');
          Locale.updateLocales();
          Locale.removeLocaleStorage(language);
          init();
        });
      }
    }

    /**
     * cloneLanguage
     * @description Click handler for adding a new translated language from a cloned one.
     * @param oldLang     Key of previous language to be cloned
     * @param newLangKey  New translationKey i.e. COMMON.LANGUAGES.<LANGUAGE>
     * @param newLang     Key of new language i.e. en_US
     */
    function cloneLanguage(oldLang, newLangKey, newLang) {
      var newTranslationKey = 'COMMON.LANGUAGES.' + angular.uppercase(newLangKey);
      if (_.contains(vm.languages, newLang)) {
        toastr.warning('The language ' + newLang + ' already exists!', 'Translation');
      }
      else if (_.contains(vm.translationKeys, newTranslationKey)) {
        toastr.warning('A language with translation key: ' + newLangKey + ' already exists!', 'Translation');
      }
      else {
        vm.translations[newLang] = angular.copy(vm.translations[oldLang]);
        vm.languages.push(newLang);

        var newTranslation = new Translation({
          language: newLang,
          translationKey: newTranslationKey,
          translation: angular.copy(vm.translations[oldLang])
        });
        newTranslation.$save().then(function (data) {
          delete vm.oldLanguage;
          delete vm.newLanguageKey;
          delete vm.newLanguage;
          toastr.success('Added new language ' + newLang + ' cloned from ' + oldLang + '!', 'Translation');
          Locale.updateLocales();
          Locale.setLocaleStorage(newLang, angular.copy(vm.translations[oldLang]));
          init();
        })
        .catch(function (err) {
          vm.languages.pop();
          delete vm.translations[newLang];
        });
      }
    }

  }
})();
