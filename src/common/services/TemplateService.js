/**
 * Utility helper functions for managing/manipulating hateoas templates
 */
(function () {
  'use strict';
  angular.module('dados.common.services.template', [])
    .service('TemplateService', TemplateService);

  function TemplateService() {
    var TYPE_MAP = {
      'string': 'textfield',
      'text': 'textfield',
      'integer': 'number',
      'float': 'number',
      'date': 'date',
      'datetime': 'date',
      'boolean': 'checkbox',
      'array': 'textfield',
      'json': 'json'
    };

    /**
     * [formToObject - converts a form to an object]
     * @param  {Object} form [form object]
     * @return {Object}      [resultant data as an object]
     */
    this.formToObject = function (form) {
      return _.reduce(form.form_questions,
        function (item, question) {
          item[question.field_name] = question.field_value;
          return item;
        }, {});
    };

    /**
     * [toField - converts a data item from the application/collection+json
     *  specification to a ng-form-builder field]
     *  @param  {Object} item [data item object]
     *  @param  {String} relation template's link relation
     *  @return {Object} ng-form-builder field object
     */
    function toField(item, relation) {
      var fields = {
        field_name: item.name,
        field_title: item.prompt,
        field_placeholder: _.startCase(relation) + ' ' + _.startCase(item.prompt),
        field_type: TYPE_MAP[item.type],
        field_validation: {
          rule: 'none',
          expression: ''
        },
        field_helpertext: 'required',
        field_options: [],
        field_hasOptions: false,
        field_required: item.required || false
      };
      if (_.isArray(item.value)) { // for enum fields
        fields.field_type = 'dropdown';
        fields.hasOptions = true;
        fields.field_options = _.map(item.value, function (option, index) {
          return {
            'option_id': index,
            'option_title': option,
            'option_value': option
          };
        });
      }
      return fields;
    }

    /**
     * [transformDeep - takes template data array and converts to form]
     *  @param  {Array} list data array from the template field
     *  @return {Array} data array of objects
     */
    function transformDeep(list, listField, relation) {
      if (!_.has(list, listField) && !_.isArray(list)) { // non-model field
        return _.merge(list, toField(list, relation));
      } else if (!_.isArray(list) && _.has(list, listField)) { // single model field
        return _.merge(list, {
          field_helpertext: 'required',
          field_options: [],
          field_hasOptions: false,
          field_required: list.required || false,
          field_type: 'singleselect',
          field_name: list.name,
          field_title: _.startCase(list.name),
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
     *  @param  {Array} list data array from the template field
     *  @return {Array} data array of objects
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
     * @param  {Object} item     [selected row item]
     * @param  {Object} template [hateoas template object]
     * @return {Object}          [resultant form object]
     */
    this.parseToForm = function (item, template) {
      // add form-builder fields to template object
      var questions = _.map(transformDeep(template.data, 'data', template.rel), function (question, index) {
        question.field_id = index + 1;
        return question;
      });

      // removes template fields from form objects
      callbackDeep(questions, 'field_questions', function (item) {
        delete item.name;
        delete item.type;
        delete item.prompt;
        delete item.value;
        delete item.data;
        return item;
      });

      return {
        form_type: 'system',
        form_name: template.rel + '_form',
        form_title: _.startCase(template.rel) + ' Form',
        form_submitText: 'Submit',
        form_cancelText: 'Cancel',
        form_questions: questions
      };
    };

    /**
     * [loadAnswerSet - when editing an item, load answers into a form]
     * @param  {Object} item     [selected row item to edit]
     * @param  {Object} template [hateoas template]
     * @param  {Object} form     [form object]
     */
    this.loadAnswerSet = function (item, template, form) {
      // if template object contains this info, will try to prepend appropriate REST url for dropdowns in form
      // i.e. /user => /study/1/user
      if (template.model && template.modelID) {
        _.map(form.items.form_questions, function (question) {
          if ((question.field_hasItem || question.field_hasItems) &&
            question.field_name !== template.model && question.field_prependURL) {
            question.field_userURL = template.model + '/' + template.modelID + '/' + question.field_userURL;
          }
          return question;
        });
      }

      if (!_.isEmpty(item)) {
        var questions = _.map(form.items.form_questions,
          function (question) {
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
