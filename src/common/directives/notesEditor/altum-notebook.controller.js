/**
 * Created by calvinsu on 2016-01-14.
 */
(function () {
  'use strict';

  angular
    .module('altum.notebook.controller', [])
    .controller('AltumNotebookController', AltumNotebookController);

  AltumNotebookController.$inject = ['NoteTypeService', '$resource', 'API'];
  function AltumNotebookController(NoteType, $resource, API) {
    var vm = this;

    // bindable variables
    vm.collection = vm.collection || {};
    vm.template = {};
    vm.emailInfo = vm.emailInfo || {};
    NoteType.query(function (noteTypes) {
      vm.noteTypes = _.indexBy(noteTypes, 'id');
    });
    var NoteResource = $resource(API.url('note'), {}, {
      'query': {
        method: 'GET', isArray: false
      }
    });

    // bindable methods
    vm.addNote = addNote;
    vm.removeElement = removeElement;
    vm.search = search;

    init();
    ///////////////////////////////////////////////////////////////////////////

    function init() {
      NoteResource.query({
        where: vm.collection,
        sort: 'createdAt DESC'
      }, function (data, header) {
        vm.template = angular.copy(data.template.data);
        vm.resource = angular.copy(data);
        vm.notes = angular.copy(data.items);
      });
    }

    /**
     * addNote
     * @description Function to add note to the notes array only
     * @param type is the note type
     * @returns {*}
     */
    function addNote(type) {
      //Clear the search field
      if (!_.isEmpty(vm.filterNormal) || !_.isEmpty(vm.filterQuery)) {
        vm.filterNormal = '';
        vm.filterQuery = '';
      }
      if (_.all(vm.notes, function (note) {
          return _.has(note, 'id');
        })) {
        vm.notes.push({
          $edit: true,
          text: null,
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

    /**
     * search
     * @description function used for searching notes when there are 30+ notes and a query is needed
     * @param value
     */
    function search(value) {
      //this way vm.collection does not get overwritten
      var query = {
        where: {referral: vm.collection.referral},
        sort: 'createdAt DESC'
      };

      if (!_.isEmpty(value)) {
        query.where.or = [
          {displayName: {'contains': value}},
          {text: {'contains': value}}
        ];
      }
      NoteResource.query(query, function (data, header) {
        vm.notes = angular.copy(data.items);
      });
    }
  }

})();
