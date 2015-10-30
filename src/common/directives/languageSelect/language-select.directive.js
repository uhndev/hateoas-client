/**
 * @name language-select
 * @description Builds a language drop-down changes locale upon new selection
 */
(function() {
  'use strict';

  angular
    .module('dados')
    .directive('languageSelect', function (LocaleService) {
      return {
        restrict: 'A',
        replace: true,
        templateUrl: 'directives/languageSelect/language-select.tpl.html',
        controller: function ($scope) {
          $scope.currentLocaleDisplayName = LocaleService.getLocaleDisplayName();
          $scope.localesDisplayNames = LocaleService.getLocalesDisplayNames();
          $scope.visible = $scope.localesDisplayNames && $scope.localesDisplayNames.length > 1;

          $scope.changeLanguage = function (locale) {
            LocaleService.setLocaleByDisplayName(locale);
          };
        }
      };
    });
})();
