describe('Controller: CreateController Tests', function(){

	var scope, ctrl, httpBackend;
	var basicForm = {
		"form_type": "system",
		"form_name": "my_form",
		"form_title": "My Form",
		"form_submitText": "Get To",
		"form_cancelText": "Da Choppa",
		"form_questions": [
			{
				"field_id": 1,
				"field_name": "my_form_textfield_1",
				"field_title": "New textfield field 1",
				"field_type": "textfield",
				"field_value": "",
				"field_placeholder": "Enter a textfield value",
				"field_validation": {
					"rule": "none",
					"expression": ""
				},
				"field_helpertext": "missing input or invalid",
				"field_hasOptions": false,
				"field_required": true,
				"field_buffer": []
			}
		]
	};

	beforeEach(module('dados.common.directives.formBuilder'));

	// Angular strips the underscores when injecting
	beforeEach(inject(function (_$controller_, _$httpBackend_, _$rootScope_, $templateCache) {
		scope = _$rootScope_.$new();
		httpBackend = _$httpBackend_;
		ctrl = _$controller_('CreateController', { $scope: scope });
		scope.vm = ctrl;
	}));

	afterEach(function() {
		httpBackend.verifyNoOutstandingExpectation();
		httpBackend.verifyNoOutstandingRequest();
	});

	describe('Basic unit tests for creating and modifying forms', function() {
		it('should at least be defined', function() {
			expect(ctrl).toBeDefined();
		});

		it('should accept a form object as input to populate builder', function() {
			ctrl.form = basicForm;
			expect(ctrl.form.form_questions.length).toEqual(basicForm.form_questions.length);
		});

		it('should create its own form object if given an empty one', function() {
			expect(ctrl.form.form_questions.length).toBe(0);
		});

		it('should be able to add and delete any type of question to the form_questions', function() {
			_.each(ctrl.addField.types, function(type) {
				ctrl.addField.new = type;
				ctrl.addNewField();
			});
			expect(ctrl.form.form_questions.length).toEqual(14);

			_.each(ctrl.form.form_questions, function(question) {
				ctrl.deleteField(1);
			});
			expect(ctrl.form.form_questions.length).toBe(0);
		});

		it('should be able to add and remove options for questions with options', function() {
			_.each(ctrl.addField.types, function(type) {
				if (type.name == 'radio' || type.name == 'dropdown' || type.name == 'checkbox-group') {
					ctrl.addField.new = type;
					ctrl.addNewField();
				}
			});

			_.each(ctrl.form.form_questions, function(field) {
				// add 3 options then delete 1
				ctrl.addOption(field);
				ctrl.addOption(field);
				ctrl.addOption(field);
				expect(field.field_options.length).toBe(3);
				ctrl.deleteOption(field, field.field_options[0]);
				expect(field.field_options.length).toBe(2);
			});
		});

		it('should remove all questions if user clicks reset', function() {
			_.each(ctrl.addField.types, function(type) {
				ctrl.addField.new = type.name;
				ctrl.addNewField();
			});
			ctrl.reset();
			expect(ctrl.form.form_questions.length).toBe(0);
		});

	});
});
