(function () {
  'use strict';

  angular
    .module('altum.note.controller', [
      'btford.markdown',
      'dados.constants'
    ])
    .controller('NoteController', NoteController);

  NoteController.$inject = ['NoteService', '$http', 'toastr', 'EmailService', 'API'];

  function NoteController(Note, $http, toastr, EmailService, API) {
    var vm = this;
    var lineHeight = 12;                               // default line height in ace-editor
    var bufferHeight = 50;                             // extra space in ace-editor
    var defaultHeight = 150;                           // default ace-editor height

    // bindable variables
    vm.email = true;
    vm.original = {};
    vm.toList = [];
    // buffer for checking if note changed
    vm.note = vm.note || null;                         // note binding
    vm.onSave = vm.onSave || angular.noop;             // callback upon adding note to collection
    vm.onUpdate = vm.onUpdate || angular.noop;         // callback upon editing note in place
    vm.collection = vm.collection || {};              // collection object i.e. { referral: 1 }
    vm.emailInfo = vm.emailInfo || {};                 //email fields
    // bindable methods
    vm.selectEdit = selectEdit;
    vm.updateNote = updateNote;
    vm.removeNote = removeNote;
    vm.emailNote = emailNote;
    vm.aceLoaded = aceLoaded;
    vm.getLineHeight = getLineHeight;

    ///////////////////////////////////////////////////////////////////////////

    /**
     * selectEdit
     * @description Click handler on ng-focus for editing a note
     */
    function selectEdit() {
      if (vm.notebook.permissions.update) {
        _.map(vm.notebook.notes, function (note) {
          note.$edit = false;
        });
        vm.note.$edit = true;
        vm.original = angular.copy(vm.note);
        vm.editor.focus();
      }
    }

    /**
     * enableAndFocusEditor
     * @description function set focus on ACE editor when creating new note and put the cursor on end of the line.
     */

    function enableAndFocusEditor(editor) {
      if (editor) {
        editor.focus();
        var session = editor.getSession();
        //Get the number of lines
        var count = session.getLength();
        //Go to end of the last line
        editor.gotoLine(count, session.getLine(count - 1).length);
        editor.setReadOnly(false);
      }
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
          if (vm.note.text) {
            Note.save(_.merge(vm.note, vm.collection), function (newNote) {

              _.merge(_.last(vm.notebook.notes), newNote);
              vm.onSave();
              toastr.success('Note successfully added to collection!', 'Notes');
            });
          }
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
      var emailData = {
        data: {
          senderName: vm.note.displayName,
          msg: vm.note.text
        },
        options: {
          from: 'altumdonotreply@uhn.ca',
          to: _.pluck(vm.toList, 'email'),
          // subject: 'Altum CMS Communication'
        }

      };

      _.merge(emailData, vm.emailInfo);

      EmailService.sendEmail(emailData);

    }

    /**
     * aceLoaded
     * @description Function to be called as soon as ui-ace has loaded, used to add listen events
     *              on focus as well as saving the editor to scope to manage focus.
     * @param _editor
     */
    function aceLoaded(_editor) {
      // save reference to editor
      vm.editor = _editor;

      // Editor part
      var _session = _editor.getSession();
      var _renderer = _editor.renderer;

      _editor.$blockScrolling = Infinity;

      enableAndFocusEditor(_editor);
      // Events
      /* _editor.on('focus', function () {
         selectEdit();
       }); */
    }

    /**
     * getLineHeight
     * @description Convenience method for returning css height of ui-ace window
     * @returns {number}
     */
    function getLineHeight() {
      if (vm.note.text) {
        return vm.note.text.split(/\r\n|\r|\n/).length * lineHeight + bufferHeight;
      } else {
        return defaultHeight;
      }
    }
  }

})();
