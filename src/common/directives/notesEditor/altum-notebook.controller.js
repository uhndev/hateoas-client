/**
 * Created by calvinsu on 2016-01-14.
 */
(function () {
  'use strict';

  angular
      .module('altum.notebook.controller', [])
      .controller('AltumNotebookController', AltumNotebookController);

  AltumNotebookController.$inject = ['ResourceFactory', 'API'];

  /* @ngInject */
  function AltumNotebookController(ResourceFactory, API) {
    var vm = this;
    var NoteResource = ResourceFactory.create(vm.url);
    var Resource = ResourceFactory.create(API.url('note'));

    init();

    ////////////////

    function init() {
      /*  if (!_.isUndefined(vm.add) && _.isFunction(vm.add)) {
       vm.addNote = vm.add;
       } else {
       vm.addNote = addNote;
       }
       */
    }

    /**
     * onAddNote
     * @description function to add note to the notes array only
     * @param type is the note type
     * @returns {*}
     */
    vm.addNote = function (type) {
      vm.newNote = {};
      vm.newNote.text = null;
      vm.newNote.noteType = type.id;
      if (vm.notes) {
        vm.notes.push(vm.newNote);
      } else {
        vm.notes = [];
        vm.notes.push(vm.newNote);
      }
    };

    /**
     * onDelete
     * @description function to delete the note
     * @param note is the note need to be deleted
     * @returns {*}
     */

    vm.delete = function (note) {
      var r = confirm('Are you sure you want to delete this note?');
      if (r === true) {
        Resource.delete(note).$promise.then(function () {
          vm.notes = NoteResource.query({});
        });
        alert('note deleted');
      }
    };

  }

})();

