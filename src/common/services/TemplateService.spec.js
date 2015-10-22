describe('TemplateService', function() {
  var SERVICE, mockForm, mockTemplate, mockSubjectTemplate, mockSubjectForm;

  beforeEach(module('dados.common.services.template'));

  beforeEach( inject( function ($injector) {
    SERVICE = $injector.get('TemplateService');
    mockTemplate = {
      rel: 'user',
      data: [
        { name: 'username', type: 'string', prompt: 'Username' },
        { name: 'email', type: 'string', prompt: 'Email' },
        { name: 'password', type: 'string', prompt: 'Password' },
        { name: 'role', type: 'string', prompt: 'Role' }
      ]
    };
    mockForm = { form_type : 'system', form_name : 'user_form', form_title : 'User Form', form_submitText : 'Submit', form_cancelText : 'Cancel', form_questions : [ { field_validation : { rule : 'none', expression : '' }, field_helpertext : 'required', field_options : [  ], field_hasOptions : false, field_required : true, field_id : 1, field_name : 'username', field_title : 'Username', field_placeholder : 'User Username', field_type : 'textfield' }, { field_validation : { rule : 'none', expression : '' }, field_helpertext : 'required', field_options : [  ], field_hasOptions : false, field_required : true, field_id : 2, field_name : 'email', field_title : 'Email', field_placeholder : 'User Email', field_type : 'textfield' }, { field_validation : { rule : 'none', expression : '' }, field_helpertext : 'required', field_options : [  ], field_hasOptions : false, field_required : true, field_id : 3, field_name : 'password', field_title : 'Password', field_placeholder : 'User Password', field_type : 'textfield' }, { field_validation : { rule : 'none', expression : '' }, field_helpertext : 'required', field_options : [  ], field_hasOptions : false, field_required : true, field_id : 4, field_name : 'role', field_title : 'Role', field_placeholder : 'User Role', field_type : 'textfield' } ] };

    mockSubjectTemplate = {
      "rel": "subject",
      "data": [
        {
          "name": "user",
          "type": "user",
          "prompt": "User",
          "value": "",
          "data": [
            {
              "name": "username",
              "type": "string",
              "prompt": "Username",
              "value": "",
              "field_id": 1
            },
            {
              "name": "email",
              "type": "string",
              "prompt": "Email",
              "value": "",
              "field_id": 2
            },
            {
              "name": "firstname",
              "type": "string",
              "prompt": "Firstname",
              "value": "",
              "field_id": 3
            },
            {
              "name": "lastname",
              "type": "string",
              "prompt": "Lastname",
              "value": "",
              "field_id": 4
            },
            {
              "name": "prefix",
              "type": "string",
              "prompt": "Prefix",
              "value": [
                "Mr.",
                "Mrs.",
                "Ms.",
                "Dr."
              ],
              "field_id": 5
            },
            {
              "name": "gender",
              "type": "string",
              "prompt": "Gender",
              "value": [
                "Male",
                "Female"
              ],
              "field_id": 6
            },
            {
              "name": "dob",
              "type": "date",
              "prompt": "Dob",
              "value": "",
              "field_id": 7
            },
            {
              "name": "group",
              "type": "group",
              "prompt": "Group",
              "value": "",
              "data": [
                {
                  "name": "name",
                  "type": "string",
                  "prompt": "Name",
                  "value": "",
                  "field_id": 1
                },
                {
                  "name": "level",
                  "type": "integer",
                  "prompt": "Level",
                  "value": [
                    1,
                    2,
                    3
                  ],
                  "field_id": 2
                },
                {
                  "name": "menu",
                  "type": "json",
                  "prompt": "Menu",
                  "value": "",
                  "field_id": 3
                }
              ],
              "field_id": 8
            }
          ]
        }
      ]
    };
    mockSubjectForm = {
      "form_type": "system",
      "form_name": "subject_form",
      "form_title": "Subject Form",
      "form_submitText": "Submit",
      "form_cancelText": "Cancel",
      "form_questions": [
        {
          "field_helpertext": "required",
          "field_options": [],
          "field_hasOptions": false,
          "field_required": true,
          "field_type": "singleselect",
          "field_name": "user",
          "field_title": "User",
          "field_userURL": "user",
          "field_questions": [
            {
              "field_id": 1,
              "field_validation": {
                "rule": "none",
                "expression": ""
              },
              "field_helpertext": "required",
              "field_options": [],
              "field_hasOptions": false,
              "field_required": true,
              "field_name": "username",
              "field_title": "Username",
              "field_placeholder": "String Username",
              "field_type": "textfield"
            },
            {
              "field_id": 2,
              "field_validation": {
                "rule": "none",
                "expression": ""
              },
              "field_helpertext": "required",
              "field_options": [],
              "field_hasOptions": false,
              "field_required": true,
              "field_name": "email",
              "field_title": "Email",
              "field_placeholder": "String Email",
              "field_type": "textfield"
            },
            {
              "field_id": 3,
              "field_validation": {
                "rule": "none",
                "expression": ""
              },
              "field_helpertext": "required",
              "field_options": [],
              "field_hasOptions": false,
              "field_required": true,
              "field_name": "firstname",
              "field_title": "Firstname",
              "field_placeholder": "String Firstname",
              "field_type": "textfield"
            },
            {
              "field_id": 4,
              "field_validation": {
                "rule": "none",
                "expression": ""
              },
              "field_helpertext": "required",
              "field_options": [],
              "field_hasOptions": false,
              "field_required": true,
              "field_name": "lastname",
              "field_title": "Lastname",
              "field_placeholder": "String Lastname",
              "field_type": "textfield"
            },
            {
              "field_id": 5,
              "field_validation": {
                "rule": "none",
                "expression": ""
              },
              "field_helpertext": "required",
              "field_options": [
                {
                  "option_id": 0,
                  "option_title": "Mr.",
                  "option_value": "Mr."
                },
                {
                  "option_id": 1,
                  "option_title": "Mrs.",
                  "option_value": "Mrs."
                },
                {
                  "option_id": 2,
                  "option_title": "Ms.",
                  "option_value": "Ms."
                },
                {
                  "option_id": 3,
                  "option_title": "Dr.",
                  "option_value": "Dr."
                }
              ],
              "field_hasOptions": false,
              "field_required": true,
              "field_name": "prefix",
              "field_title": "Prefix",
              "field_placeholder": "String Prefix",
              "field_type": "dropdown",
              "hasOptions": true
            },
            {
              "field_id": 6,
              "field_validation": {
                "rule": "none",
                "expression": ""
              },
              "field_helpertext": "required",
              "field_options": [
                {
                  "option_id": 0,
                  "option_title": "Male",
                  "option_value": "Male"
                },
                {
                  "option_id": 1,
                  "option_title": "Female",
                  "option_value": "Female"
                }
              ],
              "field_hasOptions": false,
              "field_required": true,
              "field_name": "gender",
              "field_title": "Gender",
              "field_placeholder": "String Gender",
              "field_type": "dropdown",
              "hasOptions": true
            },
            {
              "field_id": 7,
              "field_validation": {
                "rule": "none",
                "expression": ""
              },
              "field_helpertext": "required",
              "field_options": [],
              "field_hasOptions": false,
              "field_required": true,
              "field_name": "dob",
              "field_title": "Dob",
              "field_placeholder": "Date Dob",
              "field_type": "date"
            },
            {
              "field_id": 8,
              "field_helpertext": "required",
              "field_options": [],
              "field_hasOptions": false,
              "field_required": true,
              "field_type": "singleselect",
              "field_name": "group",
              "field_title": "Group",
              "field_userURL": "group",
              "field_questions": [
                {
                  "field_id": 1,
                  "field_validation": {
                    "rule": "none",
                    "expression": ""
                  },
                  "field_helpertext": "required",
                  "field_options": [],
                  "field_hasOptions": false,
                  "field_required": true,
                  "field_name": "name",
                  "field_title": "Name",
                  "field_placeholder": "String Name",
                  "field_type": "textfield"
                },
                {
                  "field_id": 2,
                  "field_validation": {
                    "rule": "none",
                    "expression": ""
                  },
                  "field_helpertext": "required",
                  "field_options": [
                    {
                      "option_id": 0,
                      "option_title": 1,
                      "option_value": 1
                    },
                    {
                      "option_id": 1,
                      "option_title": 2,
                      "option_value": 2
                    },
                    {
                      "option_id": 2,
                      "option_title": 3,
                      "option_value": 3
                    }
                  ],
                  "field_hasOptions": false,
                  "field_required": true,
                  "field_name": "level",
                  "field_title": "Level",
                  "field_placeholder": "Integer Level",
                  "field_type": "dropdown",
                  "hasOptions": true
                },
                {
                  "field_id": 3,
                  "field_validation": {
                    "rule": "none",
                    "expression": ""
                  },
                  "field_helpertext": "required",
                  "field_options": [],
                  "field_hasOptions": false,
                  "field_required": true,
                  "field_name": "menu",
                  "field_title": "Menu",
                  "field_placeholder": "Json Menu",
                  "field_type": "json"
                }
              ]
            }
          ],
          "field_id": 1
        }
      ]
    };
  }));

  it('exists', function() {
    expect(SERVICE).toBeTruthy();
    expect(_.isObject(SERVICE) && !_.isArray(SERVICE)).toBeTruthy();
  });

  it('has 4 methods', function() {
    expect(_.keys(SERVICE)).toEqual(['formToObject', 'parseToForm', 'loadAnswerSet' ]);
  });

  it('converts a form to a data object with formToObject', function() {
    var result = {
      username: '0',
      email: '1',
      password: '2',
      role: '3'
    };

    // Generate test data
    _.each(mockForm.form_questions, function(question, index) {
      question.field_value = index.toString();
    });

    expect(SERVICE.formToObject(mockForm)).toEqual(result);
  });

  it('converts a form with related models to data objects', function() {
    // fails
  });

  it('converts a data object to form', function() {
    var generated = SERVICE.parseToForm({}, mockTemplate);
    expect(generated).toEqual(mockForm);
  });

  it('converts a data object with associations to form', function() {
    var generated = SERVICE.parseToForm({}, mockSubjectTemplate);
    expect(generated).toEqual(mockSubjectForm);
  });

  it('loads answers into the form', function() {
    var result = {
      username: '0',
      email: '1',
      password: '2',
      role: '3'
    };

    var tempForm = {
      items: mockForm
    };

    SERVICE.loadAnswerSet(result, { rel: 'na'} , tempForm);

    _.each(tempForm.items.form_questions, function(question, index) {
      expect(question.field_value).toEqual(index.toString());
    });
  });

});
