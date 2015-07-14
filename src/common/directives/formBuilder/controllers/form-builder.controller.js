/**
 * Controller for handling form builder interaction and functionality
 */
(function() {
  'use strict';
  angular
    .module('dados.common.directives.formBuilder.controller', [])
    .controller('CreateController', CreateController);

  CreateController.$inject = ['$http', 'FormService'];

  function CreateController($http, FormService) {
    var vm = this;

    // bindable variables
    vm.form = {};
    vm.previewMode = false;
    vm.addField = {};
    vm.accordion = {
      oneAtATime: true
    };

    // bindable methods
    vm.addNewField = addNewField;
    vm.deleteField = deleteField;
    vm.addOption = addOption;
    vm.deleteOption = deleteOption;
    vm.reset = reset;

    init();

    ///////////////////////////////////////////////////////////////////////////

    function init() {
      // form initialization
      if (_.isEmpty(vm.form)) {
        vm.form = angular.copy(vm.form) || {};
        vm.form.form_type = 'system';
        vm.form.form_name = 'my_form';
        vm.form.form_title = 'My Form';
        vm.form.form_submitText = 'Submit';
        vm.form.form_cancelText = 'Cancel';
        vm.form.form_questions = [];
      }

      vm.form.form_questions.sort(function (a, b) {
        return a.field_id > b.field_id;
      });

      // field initialization
      var defaultField = FormService.fields[0];
      vm.addField = {
        new: defaultField,
        types: FormService.fields,        
        value_type: defaultField.value_type,
        hasOptions: defaultField.hasOptions,
        hasItems: defaultField.hasItems,
        hasItem: defaultField.hasItem,
        lastAddedID: vm.form.form_questions.length
      };

      // accordion sorting initialization
      vm.sortableOptions = {
        cursor: 'move',
        revert: true,
        stop: sortQuestions
      };
    }

    function sortQuestions() {
      for (var idx in vm.form.form_questions) {
        vm.form.form_questions[idx].field_id = ++idx;
      }
    }

    // create new field button click
    function addNewField() {
      vm.addField.lastAddedID = vm.form.form_questions.length;
      // incr field_id counter
      vm.addField.lastAddedID++;

      var newField = {
        "field_id"            : vm.addField.lastAddedID,
        "field_name"          : vm.form.form_name+"_"+vm.addField.new.name+"_"+vm.addField.lastAddedID,
        "field_title"         : "New " + vm.addField.new.name + " field " + vm.addField.lastAddedID,
        "field_type"          : vm.addField.new.name,
        "field_value"         : vm.addField.new.value_type,
        "field_placeholder"   : "Enter a "+vm.addField.new.name+" value",
        "field_validation"    : {rule:'none', expression: ''},
        "field_helpertext"    : "missing input or invalid",
        "field_hasOptions"    : vm.addField.new.hasOptions,
        "field_hasItems"      : vm.addField.new.hasItems,
        "field_hasItem"       : vm.addField.new.hasItem,
        "field_required"      : true
      };

      // put newField into fields array
      vm.form.form_questions.push(newField);
    }

    // deletes particular field on button click
    function deleteField(field_id){
      for(var i = 0; i < vm.form.form_questions.length; i++){
        if(vm.form.form_questions[i].field_id == field_id){
          vm.form.form_questions.splice(i, 1);
          break;
        }
      }
      sortQuestions();
    }

    // add new option to the field
    function addOption(field) {
      if(!field.field_options) {
        field.field_options = [];
      }

      var lastOptionID = 0;

      if(field.field_options[field.field_options.length-1]) {
        lastOptionID = field.field_options[field.field_options.length-1].option_id;
      }

      // new option's id
      var option_id = lastOptionID + 1;

      var newOption = {
        "option_id" : option_id,
        "option_title" : "Option " + option_id,
        "option_value" : "value_" + option_id
      };

      // put new option into field_options array
      field.field_options.push(newOption);
    }

    // delete particular option
    function deleteOption(field, option) {
      for (var i = 0; i < field.field_options.length; i++) {
        if (field.field_options[i].option_id == option.option_id) {
          field.field_options.splice(i, 1);
          break;
        }
      }
    }

    // deletes all the fields
    function reset(){
      vm.form.form_questions.splice(0, vm.form.form_questions.length);
      vm.addField.lastAddedID = 0;
    }
 
  }

})();
