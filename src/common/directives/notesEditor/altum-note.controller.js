(function () {
  'use strict';

  angular
    .module('altum.note.controller', [
      'contenteditable'
    ])
    .controller('NoteController', NoteController);

  NoteController.$inject = ['NoteService', 'toastr'];

  function NoteController(Note, toastr) {
    var vm = this;

    // bindable variables
    vm.original = {};                                  // buffer for checking if note changed
    vm.note = vm.note || null;                         // note binding
    vm.onSave = vm.onSave || angular.noop;             // callback upon adding note to collection
    vm.onUpdate = vm.onUpdate || angular.noop;         // callback upon editing note in place
    vm.collection = vm.collection || {};               // collection object i.e. { referral: 1 }

    // bindable methods
    vm.selectEdit = selectEdit;
    vm.updateNote = updateNote;
    vm.removeNote = removeNote;
    vm.emailNote = emailNote;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * selectEdit
     * @description Click handler on ng-focus for editing a note
     */
    function selectEdit() {
      vm.note.$edit = true;
      vm.original = angular.copy(vm.note);
    }

    /**
     * updateNote
     * @description Click handler for updating notes and saving notes to collections
     */
    function updateNote() {
      vm.note.$edit = false;
      if (!angular.equals(vm.original, vm.note)) {
        if (vm.note.id) {
          Note.update(vm.note, function (data) {
            vm.onUpdate();
            toastr.success('Note successfully updated!', 'Notes');
          });
        } else {
          Note.save(_.merge(vm.note, vm.collection), function (newNote) {
            vm.notebook.notes.pop();
            vm.note = angular.copy(newNote);
            vm.notebook.notes.push(newNote);
            vm.onSave();
            toastr.success('Note successfully added to collection!', 'Notes');
          });
        }
      }
    }

    /**
     * removeNote
     * @description Click handler for deleting/removing a note
     */
    function removeNote() {
      if (!vm.note.id) {
        vm.onRemove();
      } else {
        if (confirm('Are you sure you wish to delete this note?')) {
          Note.remove({id: vm.note.id}, function (data) {
            vm.onRemove();
            toastr.success('Note successfully removed!', 'Notes');
          });
        }
      }
    }

    /**
     * emailNote
     * @description Click handler for sending a note email
     */
    function emailNote() {
    }
  }

})();

