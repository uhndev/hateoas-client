/**
 * Created by calvinsu on 2016-01-12.
 */
(function () {
  'use strict';

  angular
      .module('altum.note', ['altum.note.controller'])
      .directive('altumNote', altumNote);

  altumNote.$inject = [];

  /* @ngInject */
  function altumNote() {
    var directive = {
      bindToController: true,
      require: '^altumNotebook',
      templateUrl: 'directives/notesEditor/altum-note.directive.tpl.html',
      controller: 'NoteController',
      controllerAs: 'at',
      link: link,
      restrict: 'E',
      scope: {
        delete: '=',
        update: '=?',
        updateNote: '&',
        note: '=',
        url: '=',
        notes: '='
      }
    };
    return directive;

    function link(scope, element, attrs) {

    }
  }

})();

