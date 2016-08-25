/**
 * Created by calvinsu on 2016-01-14.
 */
(function () {
  'use strict';
  angular
    .module('altum.notebook.controller', [])
    .controller('AltumNotebookController', AltumNotebookController);

  AltumNotebookController.$inject = ['NoteTypeService', '$resource', 'API', '$http', 'AuthService'];
  function AltumNotebookController(NoteType, $resource, API, $http, AuthService) {
    var vm = this;
    // bindable variables
    vm.collection = vm.collection || {};
    vm.template = {};
    vm.emailInfo = vm.emailInfo || {};
    vm.permissions = {};
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
      }, function (data, headers) {
        _.each(headers('allow').split(','), function (permission) {
          vm.permissions[permission] = true;
        });
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
      vm.loadingNotes = true;
      //this way vm.collection does not get overwritten
      var query = {
        where: {referral: vm.collection.referral},
        limit: 1000,
        sort: 'createdAt DESC'
      };

      if (!_.isEmpty(value)) {
        query.where.or = [
          {displayName: {'contains': value}},
          {text: {'contains': value}}
        ];
      }
      NoteResource.query(query, function (data, header) {
        vm.loadingNotes = false;
        vm.resource.count = data.count;
        vm.notes = angular.copy(data.items);
      });
    }

    //service worker functionality, checks to see if its supported, then registers the broweser to the SW and notifications, can add this codebase on first login instead
    if ('serviceWorker' in navigator) {
      console.log('Service Worker is supported');
      navigator.serviceWorker.register('src/common/directives/notesEditor/sw.js').then(function(reg) {
        //subscribes the user to notifications
        reg.pushManager.subscribe({
          userVisibleOnly: true
        }).then(function(sub) {
          var split = sub.endpoint.lastIndexOf('/') + 1;
          var endpoint = sub.endpoint.slice(split);
          var user = AuthService.currentUser.username;
          //request for server end to track active user endpoints
          $http({
            method: 'POST',
            url: API.url() + '/notifications',
            data: {
              endpoint: endpoint,
              user: user
            }
          }).then(function (results) {
              console.log('Subscribed');
            });
        });
      }).catch(function(error) {
          console.log(':^(', error);
        });
    }
  }
})();
