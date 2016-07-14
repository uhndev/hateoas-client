(function () {
  'use strict';

  angular
    .module('altum.notebook', ['altum.notebook.controller'])
    .component('altumNotebook', {
      bindings: {
        collection: '=',
        emailInfo: '='
      },
      controller: 'AltumNotebookController',
      controllerAs: 'notebook',
      templateUrl: 'directives/notesEditor/altum-notebook.tpl.html'
    });
})();
