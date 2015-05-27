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
      "json"      : "textfield"  
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
      return {
        field_name: item.name,
        field_title: item.prompt,
        field_placeholder: _.titleCase(relation + ' ' + item.prompt),
        field_type: TYPE_MAP[item.type]
      };
    }

    /**
     * [flattenLists - flattens a array of objects containing nested lists]
     *  @param  {[data]} data array from the template field
     *  @return {[array]} data array of objects
     */
    function flattenDeep(list, listField) {
      return _.reduce(list, function(result, item) {
        if (_.has(item, listField) && _.isArray(item[listField])) {
          result.concat( flattenDeep(item[listField]) );
        } else {
          result.push(item);
        }
        return result;
      }, []);
    }

    /**
     * [parseToForm - converts a template object to a form]
     * @param  {[item]} item     [selected row item]
     * @param  {[json]} template [hateoas template object]
     * @return {[json]}          [resultant form object]
     */
    this.parseToForm = function(item, template) {
      var relation = template.rel;
      // since AnswerSets don't have an href in their hateoas template
      // we need to load the form directly with the selected answerset's form
      if (relation === 'answerset' && item) {
        return item.form;
      } else {
        var dataItems = flattenDeep(template.data, 'data');

        var questions = _.map(dataItems, function(dataItem, index) {
          return _.chain(BASE_FIELD)
                  .merge({ field_id: index + 1 })
                  .merge(toField(dataItem, relation))
                  .value();
        });
        
        return {
          form_type: "system",
          form_name: relation + "_form",
          form_title: _.titleCase(relation) + " Form",
          form_submitText: "Submit",
          form_cancelText: "Cancel",
          form_questions: questions
        };
      }
    };

    /**
     * [loadAnswerSet - when editing an item, load answers into a form]
     * @param  {[json]} item     [selected row item to edit]
     * @param  {[json]} template [hateoas template]
     * @param  {[json]} form     [form object]
     * @return {[null]}          [no return; objects are modified in place]
     */
    this.loadAnswerSet = function(item, template, form) {
      if (!_.isEmpty(item)) {
        var answers = (template.rel === 'answerset' ? item.answers : item);
        var questions = _.map(form.items.form_questions,
          function(question) {
            if (_.has(item, question.field_name)) {
              question.field_value = answers[question.field_name];
            }

            return question;
          });

        form.items.form_questions = questions;
      }
    };

    /**
     * [createAnswerSet - reads from a form/template to convert to AnswerSet]
     * @param  {[json]} data     [form object result after hitting submit]
     * @param  {[json]} template [hateoas template]
     * @return {[json]}          [AnswerSet]
     */
    this.createAnswerSet = function(data, template) {
      // if filling out a user form with destination AnswerSet,
      // there exists no template, so we use the field name from
      // the form; otherwise, we read from the template as the key
      var field_keys = (!template.data || template.rel == 'answerset') ? 
                          _.pluck(data.form_questions, 'field_name') :
                          _.pluck(template.data, 'name');
      // answers from the filled out form
      var field_values = _.pluck(data.form_questions, 'field_value');
      // zip pairwise key/value pairs
      var answers = _.zipObject(field_keys, field_values);

      // if filling out user form, need to record form, subject, and person
      // otherwise, just the answers are passed to the appropriate model
      return (!template.data || template.rel == 'answerset') ? {
        form: data.id,
        subject: '2',
        person: '3',
        answers: answers
      } : answers;
    };
  }
})();
