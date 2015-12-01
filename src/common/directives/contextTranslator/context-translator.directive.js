/**
 * @name context-translator
 * @description Simple directive that binds the right click contextmenu to open a modal window
 *              containing the translate-editor directive to manage translations in context.
 * @example <ANY context-translator="TRANSLATION.KEY"></ANY>
 */

(function() {
  'use strict';

  angular
    .module('dados.common.directives.contextTranslator', ['khchan.translate-editor'])
    .directive('contextTranslator', contextTranslator)
    .controller('ContextEditorController', ContextEditorController);

  ContextEditorController.$inject = [
    '$translate', '$uibModalInstance', '$q', 'toastr', 'TranslationService', 'LocaleService', 'key'
  ];

  function contextTranslator($uibModal, AuthService, LocaleService) {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) {
        if (AuthService.isAdmin()) {
          element.bind("contextmenu", function(ev) {
            if (LocaleService.enableContextTranslation) {
              ev.preventDefault();
              ev.stopPropagation();

              $uibModal.open({
                animation: true,
                templateUrl: 'directives/contextTranslator/context-translator.tpl.html',
                controller: 'ContextEditorController',
                controllerAs: 'context',
                bindToController: true,
                size: 'lg',
                resolve: {
                  key: function () {
                    return attributes.contextTranslator;
                  }
                }
              });
            }
          });
        }
      }
    };
  }

  function ContextEditorController($translate, $uibModalInstance, $q, toastr, Translation, Locale, key) {
    var vm = this;

    // resolved
    vm.key = '//' + key.replace(/\./g, '/');

    // bindable variables
    vm.languages = Locale.getLocaleKeys();
    vm.resource = [];
    vm.translations = {};
    vm.translationsReady = false;

    // bindable methods;
    vm.saveChanges = saveChanges;
    vm.cancel = cancel;

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
        })
        .then(function () {
          $translate(key).then(function (translatedKey) {
            vm.queries = [
              {
                label: translatedKey,
                search: vm.key
              }
            ];
            vm.translationsReady = true;
          });
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
          $uibModalInstance.close();
        });
    }

    function cancel() {
      $uibModalInstance.close();
    }

  }

})();
