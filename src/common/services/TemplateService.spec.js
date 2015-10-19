describe('TemplateService', function() {
  var SERVICE, mockForm, mockTemplate;

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
