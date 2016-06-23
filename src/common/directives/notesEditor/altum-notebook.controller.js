/**
 * Created by calvinsu on 2016-01-14.
 */
(function () {
  'use strict';

  angular
    .module('altum.notebook.controller', [])
    .controller('AltumNotebookController', AltumNotebookController);

  AltumNotebookController.$inject = ['NoteService', 'NoteTypeService', '$resource', 'API', 'toastr'];
  function AltumNotebookController(Note, NoteType, $resource, API, toastr) {
    var vm = this;
    // bindable variables
    vm.notes = vm.notes || [];
    vm.collection = vm.collection || {};
    vm.template = {};
    vm.emailInfo = vm.emailInfo || {};
    vm.noteTypes = NoteType.query();
    var resource = $resource(API.url('note'), {}, {'query':{method: 'GET', isArray: false, params:vm.collection}});

    //vm.refNotes = vm.notes || [];
    // bindable methods
    vm.addNote = addNote;
    vm.removeElement = removeElement;
    vm.search = search;

    init();
    ///////////////////////////////////////////////////////////////////////////

    function init() {
      resource.query(function(data, header) {
        vm.template = angular.copy(data.template.data);
        vm.resource = angular.copy(data);
      });
    }
    /**
     * addNote
     * @description Function to add note to the notes array only
     * @param type is the note type
     * @returns {*}
     */
    function addNote(type) {
      if (!_.isEmpty(vm.filterNormal)) {
        toastr.warning('Clear the search field first');
      }else {
        if (_.all(vm.notes, function (note) { return _.has(note, 'id'); })) {
          vm.notes.push({
            $edit: true,
            text: null,
            // noteType: type.id
            noteType: type
          });
        }
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

    /**
     * search
     * @description function used for searching notes when there are 30+ notes and a query is needed
     * @param value
     */
    function search(value) {
      //this way vm.collection does not get overwritten
      var query = {where:{referral:vm.collection.referral}};
      if (!_.isEmpty(value)) {
        query.where.or = _.reduce(vm.template, function(result, field) {
          var fieldInput = {};
          switch (true) {

            case /date|dateTime|datetime/i.test(field.type):
              return result;

            case /string|text/i.test(field.type):
              fieldInput[field.name] = {'contains':value};
              return result.concat(fieldInput);

            default:
              return result;
          }
        }, []);
      }
      resource.query(query, function(data,header) {
        vm.notes = angular.copy(data.items);
      });
    }
  }

})();
