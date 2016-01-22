/**
 * Created by calvinsu on 2016-01-12.
 */
(function () {
  'use strict';

  angular
      .module('altum.notebook', ['altum.notebook.controller'])
      .directive('altumNotebook', altumNotebook);

  altumNotebook.$inject = [];

  /* @ngInject */
  function altumNotebook() {
    var directive = {
      bindToController: true,
      controller: 'AltumNotebookController',
      controllerAs: 'notebook',
      link: link,
      restrict: 'E',
      templateUrl: 'directives/notesEditor/altum-notebook.directive.tpl.html',
      scope: {
        url: '=',
        notes: '=',
        noteTypes: '=',
        add: '&'
      }
    };
    return directive;

    function link(scope, element, attrs) {

    }
  }

})();

