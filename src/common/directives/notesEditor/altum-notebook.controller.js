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

        vm.addNote = function (type) {
            alert("get called inside");
           // NoteResource.$save(note);
            vm.newNote = {};
            vm.newNote.text = '';
            vm.newNote.noteType = type.id;
            vm.notes.push(vm.newNote);

            console.log(type);
            //vm.newNote = {};
        };



        vm.delete = function (note) {
            var r = confirm("Are you sure you want to delete this note?");
            if (r === true) {
                Resource.delete(note).$promise.then(function(){
                    vm.notes = NoteResource.query({});
                });
                alert("note deleted");
            }
        };



    }

})();

