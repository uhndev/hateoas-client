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


        vm.update = function (note) {
            if (note.id) {
                note.edit = false;
                vm.Resource.update(note);
                alert("Funciton Called" + note.id);
            } else if(note.text){

                var newNote = new vm.NoteResource(note);
                newNote.$save(newNote, function(){
                    vm.notes = vm.NoteResource.query({});
                });

                alert('this is a new note' + note.id);
            }
        };

        //email Note
        vm.email = function (note) {
            var r = confirm("Are you sure you want to email this note?");
            if (r === true) {
                alert("note emailed" + note.id);
            }
        };




    }

})();

