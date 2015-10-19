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
    function flattenDeep(list, listField, relation, result) {
      if (!_.has(list, listField) && !_.isArray(list)) {
        if (!result[relation]) {
          result[relation] = [];
        }
        return result[relation].push(list);
      }
      else if (!_.isArray(list) && _.has(list, listField)) {
        return flattenDeep(list[listField], listField, list.type, result);
      } else {
        return _.map(list, function (item) {
          return flattenDeep(item, listField, relation, result);
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
      var relation = template.rel;
      var dataItems = {};
      dataItems[relation] = [];
      flattenDeep(template.data, 'data', relation, dataItems);
      console.log(dataItems);

      // build initial form with base relation fields
      var questions = _.map(dataItems[relation], function(dataItem, index) {
        return _.chain(BASE_FIELD)
                .merge({ field_id: index + 1 })
                .merge(toField(dataItem, relation))
                .value();
      });
      delete dataItems[relation];

      var idx = questions.length;
      _.forIn(dataItems, function (value, key) {
        questions.push({
          field_id: ++idx,
          field_helpertext: 'required',
          field_options: [],
          field_hasOptions: false,
          field_required: true,
          field_type: 'singleselect',
          field_name: key,
          field_title: _.titleCase(key),
          field_questions: _.map(value, function (dataItem, index) {
            return _.chain(BASE_FIELD)
              .merge({ field_id: index + 1 })
              .merge(toField(dataItem, key))
              .value();
          })
        });
      });

      return {
        form_type: "system",
        form_name: relation + "_form",
        form_title: _.titleCase(relation) + " Form",
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
