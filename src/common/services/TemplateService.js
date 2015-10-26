/**
 * Utility helper functions for managing/manipulating hateoas templates
 */
(function() {
  'use strict';
  angular.module('dados.common.services.template', [])
  .service('TemplateService', TemplateService);

  function TemplateService() {
    var TYPE_MAP = {
      "string"    : "textfield",
      "text"      : "textfield",
      "integer"   : "number",
      "float"     : "number",
      "date"      : "date",
      "datetime"  : "date",
      "boolean"   : "checkbox",
      "array"     : "textfield",
      "json"      : "json"
    };

    var BASE_FIELD = {
      field_validation: {
        rule: "none",
        expression: ""
      },
      field_helpertext: 'required',
      field_options: [],
      field_hasOptions: false,
      field_required: true
    };

    /**
     * [formToObject - converts a form to an object]
     * @param  {[form]} form [form object]
     * @return {[json]}      [resultant data as an object]
     */
    this.formToObject = function(form) {
      return _.reduce(form.form_questions,
        function(item, question) {
          item[question.field_name] = question.field_value;
          return item;
        }, {});
    };

    /**
     * [toField - converts a data item from the application/collection+json
     *  specification to a ng-form-builder field]
     *  @param  {[item]} item [data item object]
     *  @param  {[relation]} template's link relation
     *  @return {[json]} ng-form-builder field object
     */
    function toField(item, relation) {
      var fields = {
        field_name: item.name,
        field_title: item.prompt,
        field_placeholder: _.titleCase(relation + ' ' + item.prompt),
        field_type: TYPE_MAP[item.type]
      };
      if (_.isArray(item.value)) { // for enum fields
        fields.field_type = 'dropdown';
        fields.hasOptions = true;
        fields.field_options = _.map(item.value, function (option, index) {
          return {
            "option_id" : index,
            "option_title" : option,
            "option_value" : option
          };
        });
      }
      return fields;
    }

    /**
     * [transformDeep - takes template data array and converts to form]
     *  @param  {[data]} data array from the template field
     *  @return {[array]} data array of objects
     */
    function transformDeep(list, listField, relation) {
      if (!_.has(list, listField) && !_.isArray(list)) { // non-model field
        return _.merge(list, _.chain(BASE_FIELD).merge(toField(list, relation)).value());
      } else if (!_.isArray(list) && _.has(list, listField)) { // single model field
        return _.merge(list, {
          field_helpertext: 'required',
          field_options: [],
          field_hasOptions: false,
          field_required: true,
          field_type: 'singleselect',
          field_name: list.name,
          field_title: _.titleCase(list.name),
          field_userURL: list.type,
          field_questions: _.map(list[listField], function (dataItem, index) {
            dataItem.field_id = index + 1;
            return transformDeep(dataItem, listField, dataItem.type);
          })
        });
      } else {
        return _.map(list, function (item) { // list of fields
          return transformDeep(item, listField, relation);
        });
      }
    }

    /**
     * [callbackDeep - performs a given callback at leaf nodes of given recursive lists]
     *  @param  {[data]} data array from the template field
     *  @return {[array]} data array of objects
     *
     */
    function callbackDeep(list, listField, callback) {
      if (!_.has(list, listField) && !_.isArray(list)) { // non-model field
        list = callback(list);
        return list;
      }
      else if (!_.isArray(list) && _.has(list, listField)) {
        list = callback(list);
        return callbackDeep(list[listField], listField, callback);
      } else {
        return _.map(list, function (item) { // list of fields
          return callbackDeep(item, listField, callback);
        });
      }
    }

    /**
     * [parseToForm - converts a template object to a form]
     * @param  {[item]} item     [selected row item]
     * @param  {[json]} template [hateoas template object]
     * @return {[json]}          [resultant form object]
     */
    this.parseToForm = function(item, template) {
      // add form-builder fields to template object
      var questions = _.map(transformDeep(template.data, 'data', template.rel), function (question, index) {
        question.field_id = index + 1;
        return question;
      });

      // removes template fields from form objects
      callbackDeep(questions, 'field_questions', function(item) {
        delete item.name;
        delete item.type;
        delete item.prompt;
        delete item.value;
        delete item.data;
        return item;
      });

      return {
        form_type: "system",
        form_name: template.rel + "_form",
        form_title: _.titleCase(template.rel) + " Form",
        form_submitText: "Submit",
        form_cancelText: "Cancel",
        form_questions: questions
      };
    };

    /**
     * [loadAnswerSet - when editing an item, load answers into a form]
     * @param  {[json]} item     [selected row item to edit]
     * @param  {[json]} template [hateoas template]
     * @param  {[json]} form     [form object]
     * @return {[null]}          [no return; objects are modified in place]
     */
    this.loadAnswerSet = function(item, template, form) {
      if (template.study) {
        _.map(form.items.form_questions, function(question) {
          if ((question.field_hasItem || question.field_hasItems) &&
               question.field_name !== 'study' && question.field_prependURL) {
            question.field_userURL = 'study/' + template.study + '/' + question.field_userURL;
          }
          return question;
        });
      }

      if (!_.isEmpty(item)) {
        var questions = _.map(form.items.form_questions,
          function(question) {
            if (_.has(item, question.field_name)) {
              question.field_value = item[question.field_name];
            }

            return question;
          });

        form.items.form_questions = questions;
      }
    };
  }
})();
