/**
 * Utility helper functions for managing/manipulating hateoas templates
 */
angular.module('dados.common.directives.templateService', [])
.service('TemplateService', function() {

  /**
   * [parseToForm - converts a template object to a form]
   * @param  {[item]} item     [selected row item]
   * @param  {[json]} template [hateoas template object]
   * @return {[json]}          [resultant form object]
   */
  this.parseToForm = function(item, template) {
    // since AnswerSets don't have an href in their hateoas template
    // we need to load the form directly with the selected answerset's form
    if (template.rel == 'answerset' && item) {
      return item.form;
    } else {
      // mappings from sails model attribute types to input types
      var typeMap = {
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
      // recursive helper that 'flattens' arbitrarily nested templates
      var fn = function(elem) {
        if (_.has(elem, 'data')) {
          return _.map(elem.data, fn);
        } else {
          return elem;
        }
      };
      // flatten out template fields and reconstitute as form object
      var fields = _.flatten(_.map(template.data, fn));
      var questions = _.map(fields, function(elem, idx) {
        return {
          field_id: idx + 1,
          field_name: elem.name,
          field_title: elem.prompt,
          field_type: typeMap[elem.type],
          field_placeholder: template.rel + ' ' + elem.prompt,
          field_validation: {
            rule: "none",
            expression: ""
          },
          field_helpertext: 'required',
          field_options: [],
          field_hasOptions: false,
          field_required: true
        }; 
      });
      
      return {
        form_type: "system",
        form_name: template.rel + "_form",
        form_title: _.capitalize(template.rel) + " Form",
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
    var values = null;
    if (template.rel == 'answerset' && item) {
      values = _.values(item.answers);
      _.each(item.form.form_questions, function(question, idx) {
        question.field_value = values[idx];
      });
    } else {
      // if item was included in callback payload, map item values to form
      if (item) {
        // retrieve values from selected row via template data name
        values = _.map(template.data, function(temp) { return item[temp.name]; });
        // replace field values in form
        _.each(form.items.form_questions, function(question, idx) {
          question.field_value = values[idx];
        });
      }
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
});










