describe('Service: SystemFormService Tests', function () {

	// load the service module
	beforeEach(module('dados.common.directives.formBuilder'));

	// instantiate service
	var SystemFormService;
	beforeEach(inject(function (_SystemFormService_) {
		SystemFormService = _SystemFormService_;
	}));

	it('should be defined', function () {
		expect(!!SystemFormService).toBe(true);
		return true;
	});

	it('should return a non-empty fields array', function() {
		expect(SystemFormService.fields).not.toEqual(null);
		expect(SystemFormService.fields.length).not.toBe(0);
	});

});
