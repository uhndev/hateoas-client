/**
 * Created by calvinsu on 2016-01-14.
 */
(function () {
  'use strict';

  angular
    .module('altum.notebook.controller', [])
    .controller('AltumNotebookController', AltumNotebookController);

  AltumNotebookController.$inject = ['NoteService', 'NoteTypeService', '$resource', 'API'];
  function AltumNotebookController(Note, NoteType, $resource, API) {
    var vm = this;
    // bindable variables
    vm.url = API.url() + '/note';
    vm.notes = vm.notes || [];
    vm.collection = vm.collection || {};
    console.log(vm.notes);

    vm.emailInfo = vm.emailInfo || {};
    vm.noteTypes = NoteType.query();
    //vm.refNotes = vm.notes || [];
    // bindable methods
    vm.addNote = addNote;
    vm.removeElement = removeElement;

    /*init();
    ///////////////////////////////////////////////////////////////////////////
    function init(){
      var resource = $resource(API.url('note'), {},
      {'query': {
        method: 'GET',
        isArray: false,
        params:{
          referral:vm.collection.referral
        }
      }});

      resource.query({limit:10},function(data,header){
        console.log(data);
        angular.copy(data.items, vm.refNotes);
        console.log(vm.refNotes);
      });

    }*/
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

    function search(value) {
      //resource.query({where:{text:{'contains':value}}}, function(data,header){
      //vm.notes = angular.copy(data.items);
      console.log(vm.notes);
      //});
    }
  }

})();
