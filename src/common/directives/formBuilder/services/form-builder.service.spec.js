describe('Service: SystemFormFieldService Tests', function () {

	// load the service module
	beforeEach(module('dados.common.directives.formBuilder'));

	// instantiate service
	var SystemFormFieldService;
	beforeEach(inject(function (_SystemFormFieldService_) {
		SystemFormFieldService = _SystemFormFieldService_;
	}));

	it('should be defined', function () {
		expect(!!SystemFormFieldService).toBe(true);
		return true;
	});

	it('should return a non-empty fields array', function() {
		expect(SystemFormFieldService.fields).not.toEqual(null);
		expect(SystemFormFieldService.fields.length).not.toBe(0);
	});

});
