(function () {
  'use strict';

  angular
    .module('altum.notebook', ['altum.notebook.controller'])
    .component('altumNotebook', {
      transclude: true,
      bindings: {
        notes: '=',
        collection: '='
      },
      controller: 'AltumNotebookController',
      controllerAs: 'notebook',
      templateUrl: 'directives/notesEditor/altum-notebook.tpl.html'
    });
})();

