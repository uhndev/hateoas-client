(function () {
  'use strict';

  angular
    .module('altum.note', ['altum.note.controller'])
    .component('altumNote', {
      require: {
        'notebook': '^altumNotebook'
      },
      bindings: {
        note: '=',
        collection: '=',
        onUpdate: '&?',
        onRemove: '&',
        onSave: '&?'
      },
      templateUrl: 'directives/notesEditor/altum-note.tpl.html',
      controller: 'NoteController',
      controllerAs: 'at'
    });

})();

