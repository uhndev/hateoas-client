/**
 * Created by calvinsu on 2016-01-15.
 */
(function () {
  'use strict';

  angular
      .module('altum.note.controller', [])
      .controller('NoteController', NoteController);

  NoteController.$inject = ['API', 'ResourceFactory'];

  /* @ngInject */
  function NoteController(API, ResourceFactory) {
    var vm = this;
    vm.Resource = ResourceFactory.create(API.url('note'));
    vm.NoteResource = ResourceFactory.create(vm.url);

    init();

    ////////////////

    function init() {
        }

    /**
     * onUpdate
     * @description function to update or create new note
     * @param note is the note need to be update or create
     * @returns {*}
     */

    vm.update = function (note) {
      if (note.id) {
        note.edit = false;
        vm.Resource.update(note);
        alert('Funciton Called' + note.text);
      } else if (note.text) {
        alert('new' + note.text);
        var newNote = new vm.NoteResource(note);
        newNote.$save(newNote, function() {
          vm.notes = vm.NoteResource.query({});
        });
      }
    };

    /**
     * onEmil
     * @description function to email the note
     * @param note is the note need to be emailed
     * @returns {*}
     */
    vm.email = function (note) {
      var r = confirm('Are you sure you want to email this note?');
      if (r === true) {
        alert('This is the email function we will add later');
      }
    };

  }

})();

