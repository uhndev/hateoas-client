/**
 * Created by calvinsu on 2016-01-14.
 */
(function () {
  'use strict';

  angular
    .module('altum.notebook.controller', [])
    .controller('AltumNotebookController', AltumNotebookController);

  AltumNotebookController.$inject = ['NoteService', 'NoteTypeService'];

  function AltumNotebookController(Note, NoteType) {
    var vm = this;

    // bindable variables
    vm.notes = vm.notes || [];
    vm.collection = vm.collection || {};
    vm.emailInfo = vm.emailInfo || {};
    vm.noteTypes = NoteType.query();

    // bindable methods
    vm.addNote = addNote;
    vm.removeElement = removeElement;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * addNote
     * @description Function to add note to the notes array only
     * @param type is the note type
     * @returns {*}
     */
    function addNote(type) {
      if (_.all(vm.notes, function (note) { return _.has(note, 'id'); })) {
        vm.notes.push({
          $edit: true,
          text: null,
          // noteType: type.id
          noteType: type
        });
      }
    }

    /**
     * removeElement
     * @description Convenience function for removing an element from an array after deletion
     * @param array
     * @param item
     */
    function removeElement(array, item) {
      var index = array.indexOf(item);
      if (index > -1) {
        array.splice(index, 1);
      }
    }
  }

})();
